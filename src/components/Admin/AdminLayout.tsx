import React from 'react';
import { MobileAdminNavBar } from './MobileAdminNavBar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full overflow-x-hidden">
      <AdminHeader />
      <main className="w-full px-4 py-6 pb-24 md:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
      <MobileAdminNavBar />
    </div>
  );
}
