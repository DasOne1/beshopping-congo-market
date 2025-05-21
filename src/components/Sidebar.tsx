
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, User, Home, Phone, Info, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { theme } = useTheme();
  
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: ShoppingBag, label: 'Products', path: '/products' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: User, label: 'Account', path: '/account' },
    { icon: Info, label: 'About Us', path: '/about' },
    { icon: Phone, label: 'Contact', path: '/contact' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] bg-background border-r shadow-xl flex flex-col"
          >
            <div className="p-4 flex justify-between items-center">
              <Link to="/" onClick={onClose} className="flex items-center space-x-2">
                <Logo size="small" />
                <span className="text-lg font-bold text-primary">BeShop</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <Separator />
            
            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors"
                      onClick={onClose}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              
              <Separator className="my-4" />
              
              <div className="flex items-center justify-between px-3 py-2">
                <span>Theme mode</span>
                <ThemeToggle />
              </div>
            </nav>
            
            <div className="p-4 border-t">
              <Button asChild variant="default" className="w-full">
                <Link to="/contact" onClick={onClose}>
                  Contact Support
                </Link>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
