
import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Package, LayoutDashboard, ShoppingCart, BarChart3, TrendingUp, Settings } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader
} from "@/components/ui/sidebar";
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
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <Logo size="medium" className="h-8 w-8" />
          <div>
            <h2 className="text-lg font-semibold">BeShopping</h2>
            <p className="text-xs text-muted-foreground">Administration</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {adminMenu.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <NavLink to={item.href} end>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="w-full justify-start gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent/50 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span className="font-medium">{item.name}</span>
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
