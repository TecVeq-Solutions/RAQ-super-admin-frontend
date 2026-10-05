'use client';
import { useState, useEffect } from 'react';
import { Plus, Power, Trash2, Edit } from 'lucide-react';
import { api } from '@/lib/api';
import Modal from '@/components/ui/Modal';

export default function PackagesPage() {
  const [packages, setPackages] = useState<any[]>([]);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPackageId, setEditPackageId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    billing_cycle: 'monthly',
    is_active: true,
    limits: {
      max_users: -1,
      max_products: -1,
      max_customers: -1,
      max_suppliers: -1,
      max_invoices: -1
    },
    module_ids: [] as number[],
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [packagesRes, modulesRes] = await Promise.all([
        api.get('/super-admin/packages'),
        api.get('/super-admin/packages/modules')
      ]);
      setPackages(packagesRes.data);
      setModules(modulesRes.data);
    } catch (err: any) {
      setError(err.data?.message || 'Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      if (editPackageId) {
        await api.put(`/super-admin/packages/${editPackageId}`, formData);
      } else {
        await api.post('/super-admin/packages', formData);
      }
      setIsModalOpen(false);
      setEditPackageId(null);
      setFormData({
        name: '', description: '', price: 0, billing_cycle: 'monthly', is_active: true,
        limits: { max_users: -1, max_products: -1, max_customers: -1, max_suppliers: -1, max_invoices: -1 },
        module_ids: []
      });
      fetchData();
    } catch (err: any) {
      setFormError(err.data?.message || `Failed to ${editPackageId ? 'update' : 'create'} package`);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditClick = (pkg: any) => {
    setEditPackageId(pkg.id);
    setFormData({
      name: pkg.name,
      description: pkg.description || '',
      price: pkg.price,
      billing_cycle: pkg.billing_cycle,
      is_active: pkg.is_active,
      limits: {
        max_users: pkg.limits?.find((l:any) => l.limit_key === 'max_users')?.limit_value || -1,
        max_products: pkg.limits?.find((l:any) => l.limit_key === 'max_products')?.limit_value || -1,
        max_customers: pkg.limits?.find((l:any) => l.limit_key === 'max_customers')?.limit_value || -1,
        max_suppliers: pkg.limits?.find((l:any) => l.limit_key === 'max_suppliers')?.limit_value || -1,
        max_invoices: pkg.limits?.find((l:any) => l.limit_key === 'max_invoices')?.limit_value || -1
      },
      module_ids: pkg.modules?.map((m:any) => m.id) || []
    });
    setIsModalOpen(true);
  };

  const handleToggleModule = (id: number) => {
    setFormData(prev => ({
      ...prev,
      module_ids: prev.module_ids.includes(id) ? prev.module_ids.filter(m => m !== id) : [...prev.module_ids, id]
    }));
  };

  const handleAction = async (action: string, id: number) => {
    try {
      if (action === 'delete') {
        if (!confirm('Are you sure you want to delete this package?')) return;
        await api.delete(`/super-admin/packages/${id}`);
      } else if (action === 'toggle') {
        await api.patch(`/super-admin/packages/${id}/status`);
      }
      fetchData();
    } catch (err: any) {
      alert(err.data?.message || `Failed to perform action`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Packages & Plans</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage subscription tiers and module limits.</p>
        </div>
        <button onClick={() => {
            setEditPackageId(null);
            setFormData({
                name: '', description: '', price: 0, billing_cycle: 'monthly', is_active: true,
                limits: { max_users: -1, max_products: -1, max_customers: -1, max_suppliers: -1, max_invoices: -1 },
                module_ids: []
            });
            setIsModalOpen(true);
        }} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Create Package
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditPackageId(null); }} title={editPackageId ? "Edit Package" : "Create New Package"}>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 h-[60vh] overflow-y-auto px-2">
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input 
                type="text" required 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                <input 
                type="number" required min={0} step="0.01"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700"
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Billing Cycle</label>
            <select 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700"
              value={formData.billing_cycle}
              onChange={(e) => setFormData({...formData, billing_cycle: e.target.value})}
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </div>

          <div className="border-t pt-4 border-gray-200 dark:border-gray-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Package Limits (-1 for unlimited)</h4>
            <div className="grid grid-cols-2 gap-4">
                {Object.keys(formData.limits).map(key => (
                    <div key={key}>
                        <label className="block text-xs text-gray-500">{key.replace('max_', '').toUpperCase()}</label>
                        <input 
                        type="number" required min={-1}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700"
                        value={(formData.limits as any)[key]}
                        onChange={(e) => setFormData({...formData, limits: {...formData.limits, [key]: parseInt(e.target.value)}})}
                        />
                    </div>
                ))}
            </div>
          </div>

          <div className="border-t pt-4 border-gray-200 dark:border-gray-800">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Modules</h4>
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto border p-2 rounded border-gray-200 dark:border-gray-800 scrollbar-thin">
                {modules.map(mod => (
                    <label key={mod.id} className="flex items-center space-x-2 text-sm">
                        <input type="checkbox" checked={formData.module_ids.includes(mod.id)} onChange={() => handleToggleModule(mod.id)} className="rounded" />
                        <span>{mod.name}</span>
                    </label>
                ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <button type="button" onClick={() => { setIsModalOpen(false); setEditPackageId(null); }} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={formLoading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50">
              {formLoading ? 'Saving...' : (editPackageId ? 'Save Changes' : 'Create Package')}
            </button>
          </div>
        </form>
      </Modal>

      <div className="bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          {error && <div className="p-4 text-red-500">{error}</div>}
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading packages...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-950">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price / Cycle</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Limit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modules</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {packages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{pkg.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{pkg.description || 'No description'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">PKR {pkg.price}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{pkg.billing_cycle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {pkg.limits?.find((l:any) => l.limit_key === 'max_users')?.limit_value || -1} Users
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                          {pkg.modules?.map((mod:any) => (
                              <span key={mod.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  {mod.name}
                              </span>
                          ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {pkg.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button onClick={() => handleEditClick(pkg)} className="text-blue-400 hover:text-blue-500" title="Edit Package"><Edit className="h-5 w-5 inline" /></button>
                      <button onClick={() => handleAction('toggle', pkg.id)} className="text-gray-400 hover:text-gray-500" title="Toggle Status"><Power className="h-5 w-5 inline" /></button>
                      <button onClick={() => handleAction('delete', pkg.id)} className="text-red-400 hover:text-red-500" title="Delete Package"><Trash2 className="h-5 w-5 inline" /></button>
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
