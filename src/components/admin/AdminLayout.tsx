
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminMobileNav from './AdminMobileNav';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminLayout = () => {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <AdminHeader />
      
      {/* Layout principal */}
      <div className="flex w-full">
        {/* Sidebar desktop */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>
        
        {/* Contenu principal */}
        <main className="flex-1 md:ml-64 pt-16 pb-20 md:pb-6 w-full min-w-0">
          <div className="p-3 md:p-6 max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Navigation mobile */}
      <div className="md:hidden">
        <AdminMobileNav />
      </div>
    </div>
  );
};

export default AdminLayout;
