'use client';

import { useState, useEffect } from 'react';
import { Plane, TrendingDown, Bell, Map } from 'lucide-react';
import FlightMap from '@/components/FlightMap';
import FlightDeals from '@/components/FlightDeals';
import SearchBar from '@/components/SearchBar';
import PriceAlerts from '@/components/PriceAlerts';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'map' | 'deals' | 'alerts'>('map');

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Flight Tracker
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Never miss a cheap flight again
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar />
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition ${
              activeTab === 'map'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Map className="w-5 h-5" />
            <span className="font-medium">World Map</span>
          </button>
          
          <button
            onClick={() => setActiveTab('deals')}
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition ${
              activeTab === 'deals'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <TrendingDown className="w-5 h-5" />
            <span className="font-medium">Best Deals</span>
          </button>
          
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition ${
              activeTab === 'alerts'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Bell className="w-5 h-5" />
            <span className="font-medium">My Alerts</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'map' && <FlightMap />}
        {activeTab === 'deals' && <FlightDeals />}
        {activeTab === 'alerts' && <PriceAlerts />}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Flight Tracker</h3>
              <p className="text-gray-400 text-sm">
                Your personal flight deal finder. Get alerts on price drops and never overpay for flights.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Price Tracking</li>
                <li>Email Alerts</li>
                <li>World Map View</li>
                <li>Best Deals</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>FAQs</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2024 Flight Tracker. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
