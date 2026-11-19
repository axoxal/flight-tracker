'use client';

import { useState } from 'react';
import { Bell, Plus, Trash2, Check } from 'lucide-react';

interface Alert {
  id: string;
  origin: string;
  destination: string;
  targetPrice: number;
  currentPrice: number;
  active: boolean;
}

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      origin: 'JFK',
      destination: 'LHR',
      targetPrice: 250,
      currentPrice: 299,
      active: true,
    },
    {
      id: '2',
      origin: 'LAX',
      destination: 'TYO',
      targetPrice: 500,
      currentPrice: 599,
      active: true,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    origin: '',
    destination: '',
    targetPrice: '',
    email: '',
  });

  const handleCreateAlert = () => {
    // Implement alert creation
    console.log('Creating alert:', newAlert);
    setShowForm(false);
    setNewAlert({ origin: '', destination: '', targetPrice: '', email: '' });
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Price Alerts
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Get notified when flight prices drop to your target
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Alert</span>
        </button>
      </div>

      {/* Create Alert Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Create New Price Alert
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From
              </label>
              <input
                type="text"
                placeholder="Origin (e.g., JFK)"
                value={newAlert.origin}
                onChange={(e) => setNewAlert({ ...newAlert, origin: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To
              </label>
              <input
                type="text"
                placeholder="Destination (e.g., LHR)"
                value={newAlert.destination}
                onChange={(e) => setNewAlert({ ...newAlert, destination: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Price (USD)
              </label>
              <input
                type="number"
                placeholder="250"
                value={newAlert.targetPrice}
                onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={newAlert.email}
                onChange={(e) => setNewAlert({ ...newAlert, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateAlert}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Create Alert
            </button>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Price Alerts Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first alert to get notified when prices drop
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Create Alert
            </button>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleAlert(alert.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                    alert.active
                      ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                  }`}
                >
                  <Bell className="w-6 h-6" />
                </button>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      {alert.origin} → {alert.destination}
                    </span>
                    {alert.active && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Target: <span className="font-medium">${alert.targetPrice}</span> • 
                    Current: <span className={`font-medium ${alert.currentPrice <= alert.targetPrice ? 'text-green-600' : 'text-gray-900 dark:text-white'}`}>
                      ${alert.currentPrice}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {alert.currentPrice <= alert.targetPrice && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">Price Met!</span>
                  </div>
                )}
                
                <button
                  onClick={() => handleDeleteAlert(alert.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
