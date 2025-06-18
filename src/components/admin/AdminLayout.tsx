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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full flex">
        {/* Sidebar desktop uniquement */}
        {!isMobile && <AdminSidebarMenu />}
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <AdminHeader />
          
          {/* Main content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto pb-20 md:pb-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
        
        {/* Navigation mobile uniquement */}
        {isMobile && <AdminMobileNav />}
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
