'use client';
import { useState, useEffect } from 'react';
import { UsersRound, Search, MoreVertical, Shield, ChevronDown, Activity, Power, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function TenantUsersPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [selectedTenantId, setSelectedTenantId] = useState<number | ''>('');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const data = await api.get('/super-admin/tenants');
      setTenants(data.data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const fetchUsers = async (tenantId: number) => {
    if (!tenantId) return;
    try {
      setLoading(true);
      setError('');
      const response = await api.get(`/super-admin/tenants/${tenantId}/users`);
      // Handle both paginated and non-paginated responses
      const usersData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      setUsers(usersData);
    } catch (err: any) {
      setError(err.data?.message || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTenantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      setSelectedTenantId(Number(val));
      fetchUsers(Number(val));
    } else {
      setSelectedTenantId('');
      setUsers([]);
    }
  };

  const handleToggleStatus = async (user: any) => {
    if (!selectedTenantId) return;
    if (!confirm(`Are you sure you want to ${user.is_active ? 'suspend' : 'activate'} this user?`)) return;
    try {
      await api.patch(`/super-admin/tenants/${selectedTenantId}/users/${user.id}/status`, {
        is_active: !user.is_active
      });
      fetchUsers(selectedTenantId as number);
    } catch (err: any) {
      alert(err.data?.message || 'Failed to update user status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Tenant Users</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage individual users belonging to clients.</p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Client:</label>
          <div className="relative">
            <select 
              className="block w-80 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm appearance-none border cursor-pointer truncate"
              value={selectedTenantId}
              onChange={handleTenantChange}
            >
              <option value="">-- Choose a Client --</option>
              {tenants.map(t => (
                <option key={t.id} value={t.id}>{t.companyName} ({t.email})</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
      
      {!selectedTenantId ? (
        <div className="bg-white dark:bg-gray-900 shadow rounded-xl border border-gray-100 dark:border-gray-800 p-12 text-center text-gray-500">
          <div className="bg-blue-50 dark:bg-blue-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <UsersRound className="h-10 w-10 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No Client Selected</h3>
          <p className="mt-1 text-sm text-gray-500 max-w-md mx-auto">Please select a client organization from the dropdown above to view and manage their users.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 shadow-sm rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {error && <div className="p-4 bg-red-50 text-red-600 border-b border-red-100">{error}</div>}
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                Loading users...
              </div>
            ) : users.length === 0 ? (
               <div className="p-12 text-center text-gray-500">
                 <UsersRound className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                 <p>This client has no additional users yet.</p>
               </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                <thead className="bg-gray-50 dark:bg-gray-950/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User Profile</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                    <th className="relative px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-200 dark:border-blue-800">
                            <span className="text-blue-700 dark:text-blue-400 font-bold">{user.name?.charAt(0)?.toUpperCase()}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">{user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                          <Shield className="w-3 h-3 mr-1" />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border ${
                          user.is_active ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleToggleStatus(user)} 
                          className={`${user.is_active ? 'text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20'} font-medium transition-all bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-sm`}
                        >
                          {user.is_active ? 'Suspend User' : 'Activate User'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
