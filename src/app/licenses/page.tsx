'use client';
import { useState, useEffect } from 'react';
import { Key, MoreVertical, Play, Pause, RefreshCw, XCircle } from 'lucide-react';
import { api } from '@/lib/api';
import Modal from '@/components/ui/Modal';

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [tenants, setTenants] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ tenant_id: '', package_id: '', starts_at: new Date().toISOString().split('T')[0], expires_at: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ id: 0, starts_at: '', expires_at: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [licensesRes, tenantsRes, packagesRes] = await Promise.all([
        api.get('/super-admin/licenses'),
        api.get('/super-admin/tenants'),
        api.get('/super-admin/packages')
      ]);
      setLicenses(licensesRes.data.data || licensesRes.data);
      setTenants(tenantsRes.data);
      setPackages(packagesRes.data);
    } catch (err: any) {
      setError(err.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleIssueLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      await api.post('/super-admin/licenses', formData);
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      setFormError(err.data?.message || 'Failed to issue license');
    } finally {
      setFormLoading(false);
    }
  };

  const handleAction = async (action: string, id: number) => {
    try {
      const payload = (action === 'suspend' || action === 'revoke') ? { reason: 'Admin action' } : {};
      await api.post(`/super-admin/licenses/${id}/${action}`, payload);
      fetchData();
    } catch (err: any) {
      alert(err.data?.message || `Failed to ${action} license`);
    }
  };

  const openEditModal = (license: any) => {
    setEditData({
      id: license.id,
      starts_at: license.starts_at ? new Date(license.starts_at).toISOString().split('T')[0] : '',
      expires_at: license.expires_at ? new Date(license.expires_at).toISOString().split('T')[0] : '',
    });
    setEditError('');
    setIsEditModalOpen(true);
  };

  const handleEditDates = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      await api.put(`/super-admin/licenses/${editData.id}`, {
        starts_at: editData.starts_at,
        expires_at: editData.expires_at,
      });
      setIsEditModalOpen(false);
      fetchData();
    } catch (err: any) {
      setEditError(err.data?.message || 'Failed to update dates');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">License Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Issue, renew, and track software licenses.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
          <Key className="-ml-1 mr-2 h-5 w-5" />
          Issue License
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Issue New License">
        <form onSubmit={handleIssueLicense} className="space-y-4 mt-4">
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client / Tenant</label>
            <select 
              required 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700"
              value={formData.tenant_id}
              onChange={(e) => setFormData({...formData, tenant_id: e.target.value})}
            >
              <option value="">Select a Client</option>
              {tenants.map((t: any) => (
                <option key={t.id} value={t.id}>{t.companyName || t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Package</label>
            <select 
              required 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700"
              value={formData.package_id}
              onChange={(e) => setFormData({...formData, package_id: e.target.value})}
            >
              <option value="">Select a Package</option>
              {packages.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
              <input
                type="date"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700"
                value={formData.starts_at}
                onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Date</label>
              <input
                type="date"
                required
                min={formData.starts_at}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700"
                value={formData.expires_at}
                onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={formLoading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50">
              {formLoading ? 'Issuing...' : 'Issue License'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit License Dates">
        <form onSubmit={handleEditDates} className="space-y-4 mt-4">
          {editError && <div className="text-red-500 text-sm">{editError}</div>}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
              <input
                type="date"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700"
                value={editData.starts_at}
                onChange={(e) => setEditData({ ...editData, starts_at: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Date</label>
              <input
                type="date"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700"
                value={editData.expires_at}
                onChange={(e) => setEditData({ ...editData, expires_at: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={editLoading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
              {editLoading ? 'Updating...' : 'Update Dates'}
            </button>
          </div>
        </form>
      </Modal>

      <div className="bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          {error && <div className="p-4 text-red-500">{error}</div>}
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading licenses...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-950">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client & Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {licenses.map((license) => (
                  <tr key={license.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-bold text-gray-900 dark:text-white">{license.license_key}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{license.tenant?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{license.package?.name || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div>Issued: {new Date(license.starts_at).toISOString().split('T')[0]}</div>
                      <div>Expires: {license.expires_at ? new Date(license.expires_at).toISOString().split('T')[0] : 'Never'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        license.status === 'active' ? 'bg-green-100 text-green-800' : 
                        license.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {license.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        {license.status === 'active' && (
                            <button onClick={() => handleAction('suspend', license.id)} className="text-yellow-600 hover:text-yellow-900" title="Suspend"><Pause className="h-5 w-5 inline" /></button>
                        )}
                        {(license.status === 'suspended' || license.status === 'pending' || license.status === 'expired') && (
                            <button onClick={() => handleAction('activate', license.id)} className="text-green-600 hover:text-green-900" title="Activate"><Play className="h-5 w-5 inline" /></button>
                        )}
                        <button onClick={() => openEditModal(license)} className="text-purple-600 hover:text-purple-900" title="Edit Dates">
                            <svg className="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button onClick={() => handleAction('renew', license.id)} className="text-blue-600 hover:text-blue-900" title="Renew"><RefreshCw className="h-5 w-5 inline" /></button>
                        <button onClick={() => handleAction('revoke', license.id)} className="text-red-600 hover:text-red-900" title="Revoke"><XCircle className="h-5 w-5 inline" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
