import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/client';
import { KiwiScraper } from '@/lib/scrapers/kiwi-scraper';
import { AmadeusScraper } from '@/lib/scrapers/amadeus-scraper';

// Popular routes to scrape
const POPULAR_ROUTES = [
  { origin: 'JFK', destination: 'LHR' }, // New York to London
  { origin: 'LAX', destination: 'TYO' }, // LA to Tokyo
  { origin: 'MIA', destination: 'CDG' }, // Miami to Paris
  { origin: 'SFO', destination: 'SYD' }, // San Francisco to Sydney
  { origin: 'ORD', destination: 'FCO' }, // Chicago to Rome
  { origin: 'BOS', destination: 'DUB' }, // Boston to Dublin
  { origin: 'SEA', destination: 'ICN' }, // Seattle to Seoul
  { origin: 'DFW', destination: 'LHR' }, // Dallas to London
  { origin: 'ATL', destination: 'CDG' }, // Atlanta to Paris
  { origin: 'DEN', destination: 'CUN' }, // Denver to Cancun
];

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = getServiceSupabase();
    
    // Create scraping job record
    const { data: job, error: jobError } = await supabase
      .from('scraping_jobs')
      .insert({
        provider: 'multi',
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (jobError) {
      throw jobError;
    }

    let totalFlights = 0;
    let totalRoutes = 0;
    const errors: string[] = [];

    // Generate date range (next 90 days)
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 90);

    const dateFrom = today.toISOString().split('T')[0];
    const dateTo = endDate.toISOString().split('T')[0];

    // Scrape each route
    for (const route of POPULAR_ROUTES) {
      try {
        const flights = await scrapeRoute(
          route.origin,
          route.destination,
          dateFrom,
          dateTo
        );

        if (flights.length > 0) {
          // Upsert flights to database
          const { error: upsertError } = await supabase
            .from('flights')
            .upsert(flights, {
              onConflict: 'origin,destination,departure_date,airline',
            });

          if (upsertError) {
            errors.push(`Upsert error for ${route.origin}-${route.destination}: ${upsertError.message}`);
          } else {
            totalFlights += flights.length;
            totalRoutes += 1;
          }
        }
      } catch (error: any) {
        errors.push(`Scrape error for ${route.origin}-${route.destination}: ${error.message}`);
      }
    }

    // Check for price alerts that should be triggered
    await checkPriceAlerts(supabase);

    // Update scraping job
    await supabase
      .from('scraping_jobs')
      .update({
        status: errors.length > 0 ? 'completed_with_errors' : 'completed',
        routes_scraped: totalRoutes,
        flights_found: totalFlights,
        error_message: errors.length > 0 ? errors.join('\n') : null,
        completed_at: new Date().toISOString(),
      })
      .eq('id', job.id);

    return NextResponse.json({
      success: true,
      job_id: job.id,
      routes_scraped: totalRoutes,
      flights_found: totalFlights,
      errors: errors.length,
    });
  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

async function scrapeRoute(
  origin: string,
  destination: string,
  dateFrom: string,
  dateTo: string
) {
  const results: any[] = [];

  // Kiwi
  if (process.env.KIWI_API_KEY) {
    try {
      const scraper = new KiwiScraper(process.env.KIWI_API_KEY);
      const flights = await scraper.searchFlights({
        origin,
        destination,
        dateFrom,
        dateTo,
        limit: 20,
      });
      results.push(...flights);
    } catch (error) {
      console.error('Kiwi scraping error:', error);
    }
  }

  // Amadeus
  if (process.env.AMADEUS_API_KEY && process.env.AMADEUS_API_SECRET) {
    try {
      const scraper = new AmadeusScraper(
        process.env.AMADEUS_API_KEY,
        process.env.AMADEUS_API_SECRET
      );
      
      // Sample a few dates
      const dates = [
        new Date(dateFrom),
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      ];

      for (const date of dates) {
        const flights = await scraper.searchFlights({
          origin,
          destination,
          departureDate: date.toISOString().split('T')[0],
          max: 10,
        });
        results.push(...flights);
      }
    } catch (error) {
      console.error('Amadeus scraping error:', error);
    }
  }

  return results;
}

async function checkPriceAlerts(supabase: any) {
  // Get all active alerts
  const { data: alerts, error } = await supabase
    .from('price_alerts')
    .select('*')
    .eq('alert_sent', false);

  if (error || !alerts) return;

  for (const alert of alerts) {
    // Find matching flights
    const { data: flights } = await supabase
      .from('flights')
      .select('*')
      .eq('origin', alert.origin)
      .eq('destination', alert.destination)
      .lte('price', alert.target_price || 999999)
      .order('price', { ascending: true })
      .limit(5);

    if (flights && flights.length > 0) {
      // Send alert (implement email sending)
      await sendPriceAlert(alert, flights);

      // Mark alert as sent
      await supabase
        .from('price_alerts')
        .update({
          alert_sent: true,
          triggered_at: new Date().toISOString(),
        })
        .eq('id', alert.id);
    }
  }
}

async function sendPriceAlert(alert: any, flights: any[]) {
  // Implement email sending with SendGrid or similar
  console.log('Sending price alert:', {
    to: alert.user_email,
    route: `${alert.origin} → ${alert.destination}`,
    flights: flights.length,
  });
  
  // TODO: Integrate with SendGrid or another email service
}
