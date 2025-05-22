
import { Home, Search, ShoppingCart, Heart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

export function MobileNavBar() {
  const location = useLocation();
  const { cartItems } = useCart();
  const { favorites } = useFavorites();
  
  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Search, path: '/products', label: 'Search' },
    { icon: ShoppingCart, path: '/cart', label: 'Cart', count: cartItems.length },
    { icon: Heart, path: '/favorites', label: 'Favorites', count: favorites.length },
    { icon: User, path: '/account', label: 'Account' },
  ];

  return (
    <motion.div 
      className="fixed bottom-4 left-0 right-0 z-50 px-4 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <div className="bg-background/95 backdrop-blur-md shadow-lg rounded-full mx-auto max-w-sm border border-border/50">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const ItemIcon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "relative flex flex-col items-center justify-center p-3 transition-all duration-300",
                  isActive ? "text-primary" : "text-foreground/60"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="bubble"
                    className="absolute inset-0 bg-primary/20 dark:bg-primary/30 rounded-full z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative">
                  <ItemIcon className={cn(
                    "relative z-10 w-5 h-5",
                    isActive ? "text-primary" : "text-foreground/60"
                  )} />
                  
                  {item.count && item.count > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center z-20">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className={cn(
                  "text-xs mt-1 relative z-10",
                  isActive ? "font-medium text-primary" : "text-foreground/60"
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
