import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/client';
import { KiwiScraper } from '@/lib/scrapers/kiwi-scraper';
import { AmadeusScraper } from '@/lib/scrapers/amadeus-scraper';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const departDate = searchParams.get('departDate');
    const returnDate = searchParams.get('returnDate');

    if (!origin || !destination || !departDate) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Search from multiple providers
    const results = await Promise.allSettled([
      searchKiwi(origin, destination, departDate, returnDate),
      searchAmadeus(origin, destination, departDate, returnDate),
    ]);

    const flights = results
      .filter((result) => result.status === 'fulfilled')
      .flatMap((result: any) => result.value);

    // Store results in database
    const supabase = getServiceSupabase();
    if (flights.length > 0) {
      await supabase.from('flights').upsert(flights, {
        onConflict: 'origin,destination,departure_date,airline',
      });
    }

    return NextResponse.json({ flights, count: flights.length });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function searchKiwi(
  origin: string,
  destination: string,
  departDate: string,
  returnDate: string | null
) {
  if (!process.env.KIWI_API_KEY) return [];

  const scraper = new KiwiScraper(process.env.KIWI_API_KEY);
  return await scraper.searchFlights({
    origin,
    destination,
    dateFrom: departDate,
    dateTo: departDate,
    returnFrom: returnDate || undefined,
    returnTo: returnDate || undefined,
  });
}

async function searchAmadeus(
  origin: string,
  destination: string,
  departDate: string,
  returnDate: string | null
) {
  if (!process.env.AMADEUS_API_KEY || !process.env.AMADEUS_API_SECRET) return [];

  const scraper = new AmadeusScraper(
    process.env.AMADEUS_API_KEY,
    process.env.AMADEUS_API_SECRET
  );
  return await scraper.searchFlights({
    origin,
    destination,
    departureDate: departDate,
    returnDate: returnDate || undefined,
  });
}
