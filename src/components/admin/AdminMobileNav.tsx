
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

const AdminMobileNav = () => (
  <nav className="fixed bottom-2 left-0 right-0 mx-2 rounded-2xl bg-white/95 dark:bg-gray-900/95 shadow-xl border border-gray-200 dark:border-gray-700 z-50 h-16 animate-fade-in">
    <div className="flex justify-around items-center h-full px-2">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center gap-1 p-2 text-xs font-bold transition-all min-w-0 flex-1 rounded-xl',
                isActive
                  ? 'bg-primary text-white shadow-md scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary'
              )
            }
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="text-[11px] truncate text-center">{item.name}</span>
          </NavLink>
        );
      })}
    </div>
  </nav>
);

export default AdminMobileNav;
