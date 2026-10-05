'use client';
import { Users, Key, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchDashboard = async () => {
    try {
      const data = await api.get('/super-admin/dashboard');
      setStats(data.data);
    } catch (err) {
      console.error('Failed to fetch dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRenew = async (id: number) => {
    try {
      setActionLoading(id);
      await api.post(`/super-admin/licenses/${id}/renew`, {});
      await fetchDashboard();
      alert('License renewed successfully!');
    } catch (err: any) {
      alert(err.data?.message || 'Failed to renew license');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="p-8 text-center text-red-500">Failed to load dashboard data.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Central management of tenants, licenses, and packages.
        </p>
      </div>

      {/* Expiry Alerts */}
      {stats.expiring_licenses && stats.expiring_licenses.length > 0 && (
        <div className="space-y-3">
          {stats.expiring_licenses.map((license: any) => {
            let message = '';
            let isExpired = license.isExpired || license.daysRemaining === -1;
            
            if (isExpired) {
              message = `Package for ${license.clientName} has expired on ${license.expiryDate}. Please renew the package to restore service.`;
            } else if (license.daysRemaining === 0) {
              message = `Package for ${license.clientName} expires today. Please renew the package to continue service.`;
            } else if (license.daysRemaining === 1) {
              message = `Package for ${license.clientName} expires tomorrow. Please renew the package to continue service.`;
            } else {
              message = `Package for ${license.clientName} will expire in ${license.daysRemaining} days. Please renew the package to continue service.`;
            }

            return (
              <div key={license.id} className={`flex items-center justify-between p-4 border rounded-lg shadow-sm ${isExpired ? 'bg-red-50 border-red-200 text-red-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-5 h-5 shrink-0 ${isExpired ? 'text-red-600' : 'text-yellow-600'}`} />
                  <div>
                    <strong className="block font-semibold">{isExpired ? 'License Expired!' : 'License Expiring Soon!'}</strong>
                    <span className="text-sm">{message}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleRenew(license.id)}
                  disabled={actionLoading === license.id}
                  className={`px-4 py-2 text-white text-sm font-bold rounded-lg transition-colors whitespace-nowrap disabled:opacity-50 ${isExpired ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'}`}
                >
                  {actionLoading === license.id ? 'Renewing...' : 'Renew Package'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Tenants</dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.total_tenants}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Key className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Active Licenses</dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.active_licenses}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-gray-900 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Expired Licenses</dt>
                  <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.expired_licenses}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Clients</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-950">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {stats.recent_tenants?.map((client: any) => (
                  <tr key={client.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{client.companyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{client.package}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        client.licenseStatus === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {client.licenseStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Recent Licenses</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-950">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {stats.recent_licenses?.map((license: any) => (
                  <tr key={license.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">{license.key}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{license.clientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{license.expiryDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
