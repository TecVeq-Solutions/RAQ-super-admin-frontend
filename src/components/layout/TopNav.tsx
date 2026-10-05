'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Key, Users, UsersRound, LifeBuoy, CreditCard, ScrollText, Settings, Menu, X, Bell, UserCircle } from 'lucide-react';
import { useState } from 'react';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Packages', href: '/packages', icon: Package },
    { name: 'Licenses', href: '/licenses', icon: Key },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Tenant Users', href: '/tenant-users', icon: UsersRound },
    { name: 'Support', href: '/support-sessions', icon: LifeBuoy },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'Logs', href: '/logs', icon: ScrollText },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export default function TopNav() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-[1580px]  mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center mr-8">
                            <span className="text-xl font-bold text-green-600 dark:text-green-400">SuperAdmin</span>
                        </div>
                        <div className="hidden md:flex md:space-x-1 lg:space-x-4 overflow-x-auto">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={(e) => {
                                            if (item.href === '#') {
                                                e.preventDefault();
                                                alert(`${item.name} is currently under development or out of scope for Phase 1.`);
                                            }
                                        }}
                                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                            ? 'bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                                            }`}
                                    >
                                        <Icon className="mr-2 h-4 w-4" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button 
                            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            onClick={() => alert('Notifications feature will be implemented soon. It will show system alerts, tenant expirations, and important logs.')}
                            title="Notifications"
                        >
                            <Bell className="h-5 w-5" />
                        </button>
                        <button 
                            className="ml-3 p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            onClick={() => alert('User Profile settings and Logout functionality will be added here.')}
                            title="Profile & Settings"
                        >
                            <UserCircle className="h-6 w-6" />
                        </button>
                        <div className="flex items-center md:hidden ml-2">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-800">
                    <div className="pt-2 pb-3 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isActive
                                        ? 'bg-green-50 border-green-500 text-green-700 dark:bg-green-900/50 dark:border-green-400 dark:text-green-300'
                                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <Icon className="mr-3 h-5 w-5" />
                                        {item.name}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}
