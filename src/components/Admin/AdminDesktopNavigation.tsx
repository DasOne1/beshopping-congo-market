
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

export function AdminDesktopNavigation() {
  const location = useLocation();
  
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

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {navItems.map((item) => {
        const active = isActive(item.path);
        const ItemIcon = item.icon;
        
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={cn(
              "relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300",
              active 
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30" 
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            )}
          >
            {active && (
              <motion.div
                layoutId="admin-desktop-indicator"
                className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 rounded-lg z-0"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <ItemIcon className={cn(
              "relative z-10 w-5 h-5",
              active ? "text-blue-600 dark:text-blue-400" : ""
            )} />
            <span className={cn(
              "text-sm font-medium relative z-10",
              active ? "text-blue-600 dark:text-blue-400" : ""
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
