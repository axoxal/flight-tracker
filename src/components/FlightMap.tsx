'use client';

import { useEffect, useState } from 'react';
import { MapPin, DollarSign } from 'lucide-react';

interface FlightMarker {
  destination: string;
  city: string;
  country: string;
  price: number;
  latitude: number;
  longitude: number;
}

export default function FlightMap() {
  const [deals, setDeals] = useState<FlightMarker[]>([
    { destination: 'CDG', city: 'Paris', country: 'France', price: 299, latitude: 48.8566, longitude: 2.3522 },
    { destination: 'TYO', city: 'Tokyo', country: 'Japan', price: 599, latitude: 35.6762, longitude: 139.6503 },
    { destination: 'DXB', city: 'Dubai', country: 'UAE', price: 449, latitude: 25.2048, longitude: 55.2708 },
    { destination: 'SYD', city: 'Sydney', country: 'Australia', price: 799, latitude: -33.8688, longitude: 151.2093 },
    { destination: 'LHR', city: 'London', country: 'UK', price: 349, latitude: 51.5074, longitude: -0.1278 },
  ]);

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="relative h-[600px] bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-800">
          {/* Placeholder for actual map */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Interactive World Map
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Install react-map-gl with Mapbox to see live flight deals on an interactive map.
                Run: npm install react-map-gl mapbox-gl
              </p>
            </div>
          </div>
        </div>

        {/* Map Legend */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Cheap (&lt;$300)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Moderate ($300-$600)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Expensive (&gt;$600)</span>
              </div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Updated 2 minutes ago
            </span>
          </div>
        </div>
      </div>

      {/* Top Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deals.map((deal) => (
          <div
            key={deal.destination}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition group cursor-pointer"
          >
            <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 relative">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold">{deal.city}</h3>
                <p className="text-sm opacity-90">{deal.country}</p>
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {deal.price}
                    </span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
                  View Deals
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
