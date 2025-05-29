
import React from 'react';
import { MobileAdminNavBar } from './MobileAdminNavBar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6 max-w-7xl">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>
      <MobileAdminNavBar />
    </div>
  );
}
