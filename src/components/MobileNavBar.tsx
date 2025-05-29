
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
    { icon: Home, path: '/', label: 'Home' },
    { icon: Search, path: '/products', label: 'Search' },
    { icon: ShoppingCart, path: '/cart', label: 'Cart', count: cart.length },
    { icon: Heart, path: '/favorites', label: 'Favorites', count: favorites.length },
    { icon: User, path: '/account', label: 'Account' },
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
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-background/95 backdrop-blur-md shadow-lg border-t border-border/50">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const ItemIcon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "relative flex flex-col items-center justify-center p-3 transition-all duration-300",
                  active ? "text-primary" : "text-foreground/60"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="bubble"
                    className="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-full z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative">
                  <ItemIcon className={cn(
                    "relative z-10 w-5 h-5",
                    active ? "text-primary" : "text-foreground/60"
                  )} />
                  
                  {item.count && item.count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center z-20">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-1 relative z-10",
                  active ? "font-medium text-primary" : "text-foreground/60"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
