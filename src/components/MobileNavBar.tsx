
import { Home, Search, ShoppingCart, Bookmark, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function MobileNavBar() {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, path: '/', label: 'Home' },
    { icon: Search, path: '/products', label: 'Search' },
    { icon: ShoppingCart, path: '/cart', label: 'Cart' },
    { icon: Bookmark, path: '/favorites', label: 'Favorites' },
    { icon: User, path: '/account', label: 'Account' },
  ];

  return (
    <motion.div 
      className="fixed bottom-4 left-0 right-0 z-50 px-4 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <div className="glass-effect rounded-full mx-auto max-w-sm">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const ItemIcon = item.icon;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "relative flex items-center justify-center p-3",
                  isActive && "text-primary"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="bubble"
                    className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full z-0"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <ItemIcon className={cn(
                  "relative z-10 w-5 h-5",
                  isActive ? "text-primary" : "text-foreground/60"
                )} />
              </Link>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
