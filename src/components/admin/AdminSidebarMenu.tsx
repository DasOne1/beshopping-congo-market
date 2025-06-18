
import React from "react";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Settings,
  FileText,
  User,
} from "lucide-react";

const AdminSidebarMenu = () => {
  const location = useLocation();

  const items = [
    {
      title: "Tableau de bord",
      url: "/admin",
      icon: BarChart3,
    },
    {
      title: "Catalogue",
      url: "/admin/catalog",
      icon: Package,
    },
    {
      title: "Commandes",
      url: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Analyses",
      url: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Rapports",
      url: "/admin/reports",
      icon: FileText,
    },
    {
      title: "Paramètres",
      url: "/admin/settings",
      icon: Settings,
    },
    {
      title: "Profil",
      url: "/admin/profile",
      icon: User,
    },
  ];

  const isActiveRoute = (url: string) => {
    if (url === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar className="w-64 border-r bg-white dark:bg-gray-800">
      <SidebarHeader className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Administration
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={isActiveRoute(item.url) ? 
                      "bg-blue-100 text-blue-700 border-r-2 border-blue-700 dark:bg-blue-900 dark:text-blue-300" : 
                      "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                  >
                    <a href={item.url} className="flex items-center gap-3 px-3 py-2">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebarMenu;
