import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  TrendingUp,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const navigation = [
  { href: '/admin/dashboard', icon: LayoutDashboard },
  { href: '/admin/catalog', icon: Package },
  { href: '/admin/orders', icon: ShoppingCart },
  { href: '/admin/reports', icon: BarChart3 },
  { href: '/admin/analytics', icon: TrendingUp },
  { href: '/admin/settings', icon: Settings },
];

const AdminMobileNav = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb">
      <div className="bg-background/95 backdrop-blur-md shadow-lg border-t border-border/50 px-2 py-1">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navigation.map((item) => {
            const active = isActive(item.href);
            const ItemIcon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={cn(
                  'relative flex items-center justify-center p-3 transition-all duration-200 rounded-xl',
                  active ? 'text-primary' : 'text-foreground/60 hover:text-foreground/80'
                )}
                aria-label={item.href.replace('/admin/', '')}
              >
                {active && (
                  <motion.div
                    layoutId="admin-mobile-nav-bubble"
                    className="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative flex items-center justify-center">
                  <ItemIcon className="w-6 h-6" />
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminMobileNav;
