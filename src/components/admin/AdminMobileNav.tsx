
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  TrendingUp 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminMobileNav = () => {
  const navigation = [
    {
      name: 'Home',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Catalog',
      href: '/admin/catalog',
      icon: Package,
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      name: 'Reports',
      href: '/admin/reports',
      icon: BarChart3,
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: TrendingUp,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around items-center py-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400'
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminMobileNav;
