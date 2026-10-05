'use client';
import { useState, useEffect } from 'react';
import { LifeBuoy, Plus, ShieldAlert, LogOut } from 'lucide-react';
import { api } from '@/lib/api';
import Modal from '@/components/ui/Modal';

export default function SupportSessionsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<number | ''>('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleStartSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenantId || !reason.trim()) return;
    
    setLoading(true);
    try {
      const res = await api.post(`/super-admin/tenants/${selectedTenantId}/support/start`, { reason });
      alert('Support Session initiated successfully! Impersonation Token: ' + (res.data?.token || 'Generated'));
      setIsModalOpen(false);
      setReason('');
    } catch (err: any) {
      alert(err.data?.message || 'Failed to start support session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support Sessions</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Initiate impersonation sessions to help clients.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Start Session
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-800 p-6 text-center text-gray-500">
        <LifeBuoy className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No active support sessions</h3>
        <p className="mt-1 text-sm text-gray-500">Start a session to impersonate a client for support.</p>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Start Support Session">
        <form onSubmit={handleStartSession} className="space-y-5 mt-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-start border border-blue-100 dark:border-blue-800/50">
            <ShieldAlert className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              Starting a session allows you to securely access the client's workspace. All actions performed during this session are strictly audited and logged for security compliance.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Select Client to Impersonate <span className="text-red-500">*</span></label>
              <select 
                required
                className="block w-full pl-3 pr-10 py-2.5 text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm border transition-shadow cursor-pointer"
                value={selectedTenantId}
                onChange={(e) => setSelectedTenantId(Number(e.target.value))}
              >
                <option value="" disabled>-- Choose a Client --</option>
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>{t.companyName} ({t.email})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Reason for Impersonation <span className="text-red-500">*</span></label>
              <textarea 
                required
                rows={3}
                placeholder="E.g., Troubleshooting tax calculation issue reported in ticket #1234"
                className="block w-full p-3 text-sm border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm border transition-shadow resize-none"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <p className="mt-1.5 text-xs text-gray-500">This reason will be recorded in the audit logs.</p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-5 border-t border-gray-100 dark:border-gray-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors flex items-center">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connecting...
                </>
              ) : 'Connect to Workspace'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
