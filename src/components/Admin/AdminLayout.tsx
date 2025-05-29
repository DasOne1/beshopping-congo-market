
import React from 'react';
import { MobileAdminNavBar } from './MobileAdminNavBar';
import { AdminHeader } from './AdminHeader';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <main className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        {children}
      </main>
      <MobileAdminNavBar />
    </div>
  );
}
