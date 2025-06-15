
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminHeader from "./AdminHeader";
import AdminSidebarMenu from "./AdminSidebarMenu";
import AdminMobileNav from "./AdminMobileNav";
import { useIsMobile } from "@/hooks/use-mobile";

const AdminLayout = () => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/40 to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 w-full flex flex-col">
        <AdminHeader />
        <div className="flex w-full pt-16">
          {/* Sidebar desktop uniquement */}
          {!isMobile && (
            <div className="z-30">
              <AdminSidebarMenu />
            </div>
          )}
          {/* Main content */}
          <main className={`flex-1 min-w-0 ${!isMobile ? 'md:ml-64' : ''} max-w-full px-2 sm:px-4 md:px-6 py-4 animate-fade-in overflow-x-hidden ${isMobile ? 'pb-20' : 'pb-6'}`}>
            <div className="max-w-full overflow-x-hidden">
              <Outlet />
            </div>
          </main>
        </div>
        {/* Navigation mobile uniquement */}
        {isMobile && (
          <div className="md:hidden">
            <AdminMobileNav />
          </div>
        )}
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
