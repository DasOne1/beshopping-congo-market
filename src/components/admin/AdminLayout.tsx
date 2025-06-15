
import React from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminHeader from "./AdminHeader";
import AdminSidebarMenu from "./AdminSidebarMenu";
import AdminMobileNav from "./AdminMobileNav";

// Auth désactivé pour la dev UX, à réactiver si besoin
const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/40 to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 w-full flex flex-col">
        <AdminHeader />
        <div className="flex w-full pt-16">
          {/* Sidebar desktop (shadcn) */}
          <div className="hidden md:block z-30">
            <AdminSidebarMenu />
          </div>
          {/* Main content */}
          <main className="flex-1 min-w-0 md:ml-64 max-w-full px-0 sm:px-2 md:px-6 py-6 animate-fade-in">
            <SidebarTrigger className="block md:hidden mb-4" />
            <Outlet />
          </main>
        </div>
        {/* Navigation mobile */}
        <div className="md:hidden">
          <AdminMobileNav />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
