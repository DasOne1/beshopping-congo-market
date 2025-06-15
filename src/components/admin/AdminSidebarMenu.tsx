
import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Package, LayoutDashboard, ShoppingCart, BarChart3, TrendingUp, Settings, LogOut } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";

const adminMenu = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Catalogue", href: "/admin/catalog", icon: Package },
  { name: "Commandes", href: "/admin/orders", icon: ShoppingCart },
  { name: "Rapports", href: "/admin/reports", icon: BarChart3 },
  { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { name: "Paramètres", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebarMenu() {
  const location = useLocation();
  return (
    <Sidebar variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex flex-col items-center py-6">
            <Logo size="small" className="mb-2" />
            <span className="font-bold text-xl text-primary text-center leading-none">BeShopping</span>
            <span className="text-xs text-muted-foreground mt-1">Admin</span>
          </div>
          <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-gray-500 mt-2 mb-1">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminMenu.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <NavLink to={item.href} end>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="h-5 w-5" />
                          <span>{item.name}</span>
                        </div>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
