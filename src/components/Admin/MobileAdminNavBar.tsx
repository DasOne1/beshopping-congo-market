
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export function MobileAdminNavBar() {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navItems = [
    { icon: LayoutDashboard, path: '/admin', label: 'Dashboard' },
    { icon: ShoppingBag, path: '/admin/orders', label: 'Orders' },
    { icon: Package, path: '/admin/catalog', label: 'Catalog' },
    { icon: Users, path: '/admin/customers', label: 'Customers' },
    { icon: BarChart3, path: '/admin/analytics', label: 'Analytics' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  // Afficher seulement sur mobile
  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl border-t border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-5 items-center px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const ItemIcon = item.icon;
          
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-300 mx-1",
                active 
                  ? "text-blue-600 dark:text-blue-400" 
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              {active && (
                <motion.div
                  layoutId="admin-mobile-indicator"
                  className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <ItemIcon className={cn(
                "relative z-10 w-5 h-5 mb-1",
                active ? "text-blue-600 dark:text-blue-400" : ""
              )} />
              <span className={cn(
                "text-[10px] relative z-10 font-medium leading-tight",
                active ? "text-blue-600 dark:text-blue-400" : ""
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default MobileAdminNavBar;
