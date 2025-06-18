
import React from "react";
import { useLocation } from "react-router-dom";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Settings,
  FileText,
  User,
} from "lucide-react";

const AdminMobileNav = () => {
  const location = useLocation();

  const items = [
    {
      title: "Dashboard",
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 md:hidden">
      <div className="flex justify-around items-center py-2">
        {items.map((item) => (
          <a
            key={item.title}
            href={item.url}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              isActiveRoute(item.url)
                ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{item.title}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};

export default AdminMobileNav;
