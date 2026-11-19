import { NextRequest, NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const supabase = getServiceSupabase();
    
    // Get trending price drops
    const { data: trendingDeals, error: trendingError } = await supabase
      .from('trending_price_drops')
      .select('*')
      .limit(20);

    if (trendingError) {
      console.error('Trending deals error:', trendingError);
    }

    // Get cheapest flights by route
    const { data: cheapestDeals, error: cheapestError } = await supabase
      .from('cheapest_flights_by_route')
      .select('*')
      .order('price', { ascending: true })
      .limit(50);

    if (cheapestError) {
      console.error('Cheapest deals error:', cheapestError);
    }

    // Combine and deduplicate
    const allDeals = [
      ...(trendingDeals || []),
      ...(cheapestDeals || []),
    ];

    // Remove duplicates based on flight ID
    const uniqueDeals = Array.from(
      new Map(allDeals.map(deal => [deal.id, deal])).values()
    );

    return NextResponse.json({
      deals: uniqueDeals,
      trending: trendingDeals || [],
      cheapest: cheapestDeals || [],
    });
  } catch (error) {
    console.error('Deals API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', deals: [] },
      { status: 500 }
    );
  }
}
