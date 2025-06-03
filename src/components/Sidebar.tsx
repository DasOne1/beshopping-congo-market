import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Heart, User, Home, Phone, Info, Menu, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
} from '@/components/ui/drawer';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { theme, setTheme } = useTheme();
  const { cart } = useCart();
  const { favorites } = useFavorites();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  const menuItems = [
    { icon: Home, label: 'Accueil', path: '/' },
    { icon: ShoppingBag, label: 'Produits', path: '/products' },
    { icon: Heart, label: 'Favoris', path: '/favorites', badge: favorites.length },
    { icon: User, label: 'Compte', path: '/account' },
    { icon: Wand2, label: 'Commande Personnalisée', path: '/custom-order' },
    { icon: Info, label: 'À propos', path: '/about' },
    { icon: Phone, label: 'Contact', path: '/contact' },
  ];

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="flex items-center justify-between border-b pb-2">
          <Link to="/" onClick={onClose} className="flex items-center space-x-2">
            <img src="/shopping-cart-logo.svg" alt="BeShopping Logo" className="h-10 w-10" />
            <span className="text-lg font-bold text-primary">BeShopping</span>
          </Link>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Fermer</span>
            </Button>
          </DrawerClose>
        </DrawerHeader>
          
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors"
                  onClick={onClose}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          
          <Separator className="my-4" />
          
          <div className="flex items-center justify-between px-3 py-2">
            <span>Mode thème</span>
            <button onClick={toggleTheme} className="p-1" title="Changer le thème">
              <ThemeToggle />
            </button>
          </div>
        </nav>
        
        <DrawerFooter className="border-t pt-2">
          <Button asChild variant="default" className="w-full">
            <Link to="/contact" onClick={onClose}>
              Support Contact
            </Link>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;
