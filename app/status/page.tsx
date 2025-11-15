'use client';

import { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, Globe, Languages, Clock, AlertCircle } from 'lucide-react';

interface HealthStatus {
  status: string;
  service: string;
  timestamp: string;
  activeProcesses: number;
  supportedLanguages: number;
  domain: string;
}

export default function StatusPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://api.kurdforest.xyz/api/health');
      if (!res.ok) {
        throw new Error('Failed to fetch health status');
      }
      const data: HealthStatus = await res.json();
      setHealth(data);
      setLastChecked(new Date());
    } catch (err) {
      console.error('Health check failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch health status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const isHealthy = health?.status === 'OK';

  return (
    <div className="min-h-screen bg-black pt-6 sm:pt-8 pb-24">
      <div className="container-custom max-w-4xl">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400" />
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold" data-testid="text-page-title">
              System Status
            </h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">
            Real-time status of all services and APIs
          </p>
        </div>

        {loading && !health ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-pulse text-gray-500">Loading status...</div>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <XCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-red-500 font-bold text-lg mb-2">Service Unavailable</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Unable to connect to the status API. Please try again later.
                </p>
                <button
                  onClick={fetchHealth}
                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl button-press font-semibold text-sm"
                  data-testid="button-retry"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        ) : health ? (
          <div className="space-y-6">
            <div className={`rounded-xl border p-6 sm:p-8 transition-all duration-300 ${
              isHealthy
                ? 'bg-green-900/20 border-green-500/50 shadow-green-500/10 shadow-lg'
                : 'bg-red-900/20 border-red-500/50 shadow-red-500/10 shadow-lg'
            }`}>
              <div className="flex items-start gap-4 mb-6">
                {isHealthy ? (
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${
                    isHealthy ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {isHealthy ? 'All Systems Operational' : 'Service Disruption'}
                  </h2>
                  <p className="text-gray-300 text-sm sm:text-base">
                    {isHealthy
                      ? 'All services are running smoothly and operating normally.'
                      : 'Some services are experiencing issues. Our team is working on it.'}
                  </p>
                </div>
              </div>

              {lastChecked && (
                <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Last checked: {lastChecked.toLocaleTimeString()}</span>
                </div>
              )}
            </div>

            <div className="bg-card-bg rounded-xl border border-card-border shadow-card p-6 sm:p-8">
              <h3 className="text-white text-lg sm:text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-yellow-400" />
                Service Details
              </h3>

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 p-4 bg-black/40 rounded-lg border border-gray-800">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      isHealthy ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}>
                      <Activity className={`w-5 h-5 ${
                        isHealthy ? 'text-green-500' : 'text-red-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-semibold text-sm sm:text-base mb-1">
                        {health.service}
                      </h4>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        Primary subtitle processing service
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                    isHealthy
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-red-500/20 text-red-500'
                  }`}>
                    {health.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 bg-black/40 rounded-lg border border-gray-800">
                    <div className="p-2 rounded-lg bg-yellow-400/10">
                      <Languages className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Supported Languages</p>
                      <p className="text-white font-bold text-lg sm:text-xl">
                        {health.supportedLanguages}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-black/40 rounded-lg border border-gray-800">
                    <div className="p-2 rounded-lg bg-yellow-400/10">
                      <Activity className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Active Processes</p>
                      <p className="text-white font-bold text-lg sm:text-xl">
                        {health.activeProcesses}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-black/40 rounded-lg border border-gray-800">
                  <div className="p-2 rounded-lg bg-yellow-400/10">
                    <Globe className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">API Domain</p>
                    <p className="text-white font-medium text-sm break-all">
                      {health.domain}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card-bg rounded-xl border border-card-border shadow-card p-6 sm:p-8">
              <h3 className="text-white text-lg sm:text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                About
              </h3>
              <div className="space-y-3">
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  This status page provides real-time information about the health and availability of the KurdForest subtitle API services. The system automatically checks the health of all services every 30 seconds.
                </p>
                <div className="pt-4 border-t border-gray-800">
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Made with care by{' '}
                    <span className="text-yellow-400 font-semibold">Akar1881</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
