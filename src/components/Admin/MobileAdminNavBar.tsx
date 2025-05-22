
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileAdminNavBar() {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, path: '/admin', label: 'Dashboard' },
    { icon: ShoppingBag, path: '/admin/orders', label: 'Orders' },
    { icon: Package, path: '/admin/products', label: 'Catalog' },
    { icon: Users, path: '/admin/customers', label: 'Customers' },
    { icon: BarChart3, path: '/admin/analytics', label: 'Analytics' },
    { icon: Settings, path: '/admin/settings', label: 'Settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-2 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-background shadow-lg rounded-xl mx-auto border border-border/50">
        <div className="grid grid-cols-6 items-center">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const ItemIcon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "relative flex flex-col items-center justify-center p-2 transition-all duration-300",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="admin-bubble"
                    className="absolute inset-0 bg-primary/10 rounded-lg z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <ItemIcon className={cn(
                  "relative z-10 w-5 h-5",
                  active ? "text-primary" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-xs mt-1 relative z-10",
                  active ? "font-medium" : ""
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default MobileAdminNavBar;
