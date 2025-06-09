import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  TrendingUp,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminMobileNav = () => {
  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Catalogue',
      href: '/admin/catalog',
      icon: Package,
    },
    {
      name: 'Commandes',
      href: '/admin/orders',
      icon: ShoppingCart,
    },
    {
      name: 'Rapports',
      href: '/admin/reports',
      icon: BarChart3,
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: TrendingUp,
    },
    {
      name: 'Paramètres',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 h-16">
      <div className="flex justify-around items-center h-full px-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 px-1 py-1 text-xs font-medium transition-colors min-w-0 flex-1',
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                )
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="text-[10px] truncate text-center">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminMobileNav;
