'use client';
import { usePathname } from 'next/navigation';
import TopNav from './TopNav';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLogin = pathname === '/login';

    if (isLogin) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <TopNav />
            <main className="max-w-[1580px]  mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}




