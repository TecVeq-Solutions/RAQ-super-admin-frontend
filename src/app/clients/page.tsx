'use client';
import { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Eye, EyeOff, Activity, Edit, Trash2, Shield, Users } from 'lucide-react';
import { api } from '@/lib/api';
import Modal from '@/components/ui/Modal';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    admin_name: '',
    admin_email: '',
    admin_password: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [viewClient, setViewClient] = useState<any>(null);
  const [editClient, setEditClient] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({ business_name: '', owner_name: '', email: '' });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await api.get('/super-admin/tenants');
      setClients(data.data);
    } catch (err: any) {
      setError(err.data?.message || 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      await api.post('/super-admin/tenants', formData);
      setIsModalOpen(false);
      setShowPassword(false);
      setFormData({ business_name: '', admin_name: '', admin_email: '', admin_password: '' });
      fetchClients();
    } catch (err: any) {
      setFormError(err.data?.message || 'Failed to create client');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClient = async (id: number) => {
    if (!confirm('Are you sure you want to permanently delete this client? This will delete all their data and cannot be undone.')) return;
    try {
      await api.post(`/super-admin/tenants/${id}/delete`);
      fetchClients();
    } catch (err: any) {
      alert(err.data?.message || 'Failed to delete client');
    }
  };

  const handleEditClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await api.put(`/super-admin/tenants/${editClient.id}`, editFormData);
      setEditClient(null);
      fetchClients();
    } catch (err: any) {
      alert(err.data?.message || 'Failed to update client');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">Clients & Tenants</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage all registered client organizations and their workspaces.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-md text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Client
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Client">
        <form onSubmit={handleCreateClient} className="space-y-4 mt-4">
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Name</label>
            <input 
              type="text" required 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700"
              value={formData.business_name}
              onChange={(e) => setFormData({...formData, business_name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Name</label>
            <input 
              type="text" required 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700"
              value={formData.admin_name}
              onChange={(e) => setFormData({...formData, admin_name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Email</label>
            <input 
              type="email" required 
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700"
              value={formData.admin_email}
              onChange={(e) => setFormData({...formData, admin_email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Password</label>
            <div className="relative mt-1">
              <input 
                type={showPassword ? "text" : "password"} required minLength={8}
                className="block w-full border border-gray-300 rounded-md shadow-sm p-2 pr-10 dark:bg-gray-800 dark:border-gray-700"
                value={formData.admin_password}
                onChange={(e) => setFormData({...formData, admin_password: e.target.value})}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={formLoading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50">
              {formLoading ? 'Creating...' : 'Create Client'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewClient} onClose={() => setViewClient(null)} title="Client Details">
        {viewClient && (
          <div className="space-y-4 mt-4 text-sm text-gray-700 dark:text-gray-300">
            <div><strong>Company Name:</strong> {viewClient.companyName}</div>
            <div><strong>Owner:</strong> {viewClient.owner}</div>
            <div><strong>Email:</strong> {viewClient.email}</div>
            <div><strong>Package:</strong> {viewClient.package}</div>
            <div><strong>Users:</strong> {viewClient.users}</div>
            <div><strong>License Status:</strong> {viewClient.licenseStatus}</div>
            <div><strong>Created At:</strong> {viewClient.createdAt}</div>
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <button type="button" onClick={() => setViewClient(null)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editClient} onClose={() => setEditClient(null)} title="Edit Client">
        {editClient && (
          <form onSubmit={handleEditClientSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business Name</label>
              <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white" value={editFormData.business_name} onChange={(e) => setEditFormData({...editFormData, business_name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Owner Name</label>
              <input type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white" value={editFormData.owner_name} onChange={(e) => setEditFormData({...editFormData, owner_name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Admin Email</label>
              <input type="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-gray-800 dark:border-gray-700 text-gray-900 dark:text-white" value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} />
            </div>
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button type="button" onClick={() => setEditClient(null)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
              <button type="submit" disabled={formLoading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
                {formLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <div className="bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <div className="relative rounded-md shadow-sm max-w-sm w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md p-2 border" placeholder="Search clients..." />
            </div>
        </div>
        <div className="overflow-visible pb-16">
          {error && <div className="p-4 text-red-500">{error}</div>}
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading clients...</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-950">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License Status</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 rounded-full flex items-center justify-center shadow-inner border border-green-200 dark:border-green-800">
                          <span className="text-green-700 dark:text-green-400 font-bold text-lg">{client.companyName?.charAt(0)?.toUpperCase() || 'C'}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900 dark:text-white">{client.companyName}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Created: {client.createdAt}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white font-medium">
                        <Shield className="w-4 h-4 mr-2 text-gray-400" />
                        {client.owner}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-6">{client.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                        {client.package}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        {client.users} Users
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full border ${
                        client.licenseStatus === 'Active' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                      }`}>
                        {client.licenseStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      <button 
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        onClick={() => setOpenDropdownId(openDropdownId === client.id ? null : client.id)}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      
                      {openDropdownId === client.id && (
                        <div className="absolute right-8 top-full mt-1 w-48 rounded-xl shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 overflow-hidden border border-gray-100 dark:border-gray-700 transform transition-all">
                          <div className="py-1 flex flex-col" role="menu">
                            <button className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" onClick={() => { setViewClient(client); setOpenDropdownId(null); }}><Activity className="w-4 h-4 mr-2 text-blue-500" /> View Details</button>
                            <button className="flex items-center w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors" onClick={() => { setEditClient(client); setEditFormData({ business_name: client.companyName, owner_name: client.owner, email: client.email }); setOpenDropdownId(null); }}><Edit className="w-4 h-4 mr-2 text-yellow-500" /> Edit Client</button>
                            <div className="h-px bg-gray-100 dark:border-gray-700 my-1 w-full"></div>
                            <button className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-semibold" onClick={() => { handleDeleteClient(client.id); setOpenDropdownId(null); }}><Trash2 className="w-4 h-4 mr-2" /> Delete Client</button>
                          </div>
                        </div>
                      )}
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
