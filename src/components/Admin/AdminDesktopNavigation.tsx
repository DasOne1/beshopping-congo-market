
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
    { icon: LayoutDashboard, path: '/dasgabriel@adminaccess/dashboard', label: 'Dashboard' },
    { icon: ShoppingBag, path: '/dasgabriel@adminaccess/orders', label: 'Orders' },
    { icon: Package, path: '/dasgabriel@adminaccess/catalog', label: 'Catalog' },
    { icon: Users, path: '/dasgabriel@adminaccess/customers', label: 'Customers' },
    { icon: BarChart3, path: '/dasgabriel@adminaccess/analytics', label: 'Analytics' },
  ];

  const isActive = (path: string) => {
    if (path === '/dasgabriel@adminaccess/dashboard') {
      return location.pathname === '/dasgabriel@adminaccess/dashboard' || location.pathname === '/dasgabriel@adminaccess';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="hidden md:flex items-center space-x-1">
      {navItems.map((item) => {
        const active = isActive(item.path);
        const ItemIcon = item.icon;
        
        return (
          <Link 
            key={item.path} 
            to={item.path}
            className={cn(
              "relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium",
              active 
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30" 
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            )}
          >
            {active && (
              <motion.div
                layoutId="admin-desktop-indicator"
                className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 rounded-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <ItemIcon className={cn(
              "relative z-10 w-4 h-4",
              active ? "text-blue-600 dark:text-blue-400" : ""
            )} />
            <span className={cn(
              "relative z-10",
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
