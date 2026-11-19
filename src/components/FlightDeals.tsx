'use client';

import { useEffect, useState } from 'react';
import { TrendingDown, Clock, Plane, ExternalLink } from 'lucide-react';
import { Flight } from '@/types/flight';

export default function FlightDeals() {
  const [deals, setDeals] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/flights/deals');
      const data = await response.json();
      setDeals(data.deals || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Mock data for demonstration
  const mockDeals: Partial<Flight>[] = [
    {
      id: '1',
      origin: 'JFK',
      destination: 'LHR',
      origin_city: 'New York',
      destination_city: 'London',
      departure_date: '2024-03-15',
      return_date: '2024-03-22',
      price: 299,
      currency: 'USD',
      airline: 'British Airways',
      direct_flight: false,
      stops: 1,
      booking_link: 'https://example.com',
    },
    {
      id: '2',
      origin: 'LAX',
      destination: 'TYO',
      origin_city: 'Los Angeles',
      destination_city: 'Tokyo',
      departure_date: '2024-04-01',
      return_date: '2024-04-10',
      price: 599,
      currency: 'USD',
      airline: 'ANA',
      direct_flight: true,
      stops: 0,
      booking_link: 'https://example.com',
    },
    {
      id: '3',
      origin: 'MIA',
      destination: 'CDG',
      origin_city: 'Miami',
      destination_city: 'Paris',
      departure_date: '2024-05-12',
      return_date: '2024-05-19',
      price: 349,
      currency: 'USD',
      airline: 'Air France',
      direct_flight: false,
      stops: 1,
      booking_link: 'https://example.com',
    },
  ];

  const displayDeals = deals.length > 0 ? deals : mockDeals;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🔥 Hottest Flight Deals
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Updated in real-time from multiple providers
          </p>
        </div>
        
        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
          <option>All Destinations</option>
          <option>Europe</option>
          <option>Asia</option>
          <option>Americas</option>
          <option>Africa</option>
          <option>Oceania</option>
        </select>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 gap-6">
        {displayDeals.map((deal) => (
          <div
            key={deal.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                {/* Flight Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {deal.origin}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {deal.origin_city}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex items-center space-x-2">
                        <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
                        <Plane className="w-5 h-5 text-blue-600 transform rotate-90" />
                        <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1"></div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {deal.destination}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {deal.destination_city}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{deal.direct_flight ? 'Direct' : `${deal.stops} stop${deal.stops! > 1 ? 's' : ''}`}</span>
                    </div>
                    <div>•</div>
                    <div>{deal.airline}</div>
                    <div>•</div>
                    <div>
                      {new Date(deal.departure_date!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {deal.return_date && ` - ${new Date(deal.return_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="ml-6 text-right">
                  <div className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs font-medium mb-2">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    23% off
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${deal.price}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    per person
                  </div>
                  <button className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center space-x-2">
                    <span>Book Now</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-gray-800 transition">
          Load More Deals
        </button>
      </div>
    </div>
  );
}
