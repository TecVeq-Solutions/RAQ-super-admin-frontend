import { CreditCard, Search } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments & Billing</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Track incoming payments from tenants.</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-900 shadow rounded-lg border border-gray-200 dark:border-gray-800 p-6 text-center text-gray-500">
        <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No recent transactions</h3>
        <p className="mt-1 text-sm text-gray-500">All tenant payments will appear here.</p>
      </div>
    </div>
  );
}
