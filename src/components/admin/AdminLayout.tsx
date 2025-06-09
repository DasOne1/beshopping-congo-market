
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AdminMobileNav from './AdminMobileNav';

const AdminLayout = () => {
  // Authentification temporairement désactivée pour permettre l'accès
  // const { isAuthenticated, loading } = useAdminAuth();

  // if (loading) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  //     </div>
  //   );
  // }

  // if (!isAuthenticated) {
  //   return <Navigate to="/admin/auth" replace />;
  // }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <AdminHeader />
      
      {/* Layout principal */}
      <div className="flex">
        {/* Sidebar desktop */}
        <div className="hidden md:block">
          <AdminSidebar />
        </div>
        
        {/* Contenu principal */}
        <main className="flex-1 md:ml-64 pt-16 pb-16 md:pb-4">
          <div className="p-4 md:p-6">
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
