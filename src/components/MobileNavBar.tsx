import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useIsMobile } from '@/hooks/use-mobile';

export function MobileNavBar() {
  const location = useLocation();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  const isMobile = useIsMobile();
  
  const navItems = [
    { icon: Home, path: '/' },
    { icon: Search, path: '/products' },
    { icon: ShoppingCart, path: '/cart', count: cart.length },
    { icon: Heart, path: '/favorites', count: favorites.length },
    { icon: User, path: '/account' },
  ];

  // Afficher seulement sur mobile
  if (!isMobile) {
    return null;
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 safe-area-pb">
      <div className="bg-background/95 backdrop-blur-md shadow-lg border-t border-border/50 px-2 py-1">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const ItemIcon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "relative flex items-center justify-center p-3 transition-all duration-200 rounded-xl",
                  active ? "text-primary" : "text-foreground/60 hover:text-foreground/80"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="mobile-nav-bubble"
                    className="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative flex items-center justify-center">
                  <ItemIcon className="w-6 h-6" />
                  
                  {item.count && item.count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium shadow-sm">
                      {item.count > 99 ? '99+' : item.count}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
