import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Global Settings</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Configure payment gateways and system preferences.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment Gateways</h3>
            <p className="text-sm text-gray-500 mb-4">Configure JazzCash, EasyPaisa, or Bank Transfers.</p>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-sm font-medium rounded-md">Configure</button>
          </div>
          <div className="bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Email Configuration</h3>
            <p className="text-sm text-gray-500 mb-4">Set up SMTP for system notifications.</p>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-sm font-medium rounded-md">Configure</button>
          </div>
      </div>
    </div>
  );
}
