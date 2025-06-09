
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  TrendingUp,
  Users,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
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
  ];

  return (
    <div className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                )
              }
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;
