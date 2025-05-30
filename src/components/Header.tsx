
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Heart, 
  Menu, 
  Search, 
  X,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Logo } from '@/components/Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from './Sidebar';

const Header = () => {
  const { getTotalQuantity } = useCart();
  const { favorites } = useFavorites();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search query
    console.log('Search for:', searchQuery);
    setIsSearchOpen(false);
  };

  const cartQuantity = getTotalQuantity();
  const favoriteQuantity = favorites.length;

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 shadow-sm backdrop-blur-md border-b border-border/40">
      <div className="container flex h-14 md:h-16 items-center">
        {/* Menu Button et Logo - à gauche */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={toggleMenu}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Logo size="small" asLink />
            <Link to="/" className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                BeShop
              </span>
            </Link>
          </div>
        </div>

        {/* Desktop Navigation - centré */}
        <nav className="hidden md:flex items-center space-x-6 flex-1 ml-8">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Accueil
          </Link>
          <Link to="/products" className="text-sm font-medium transition-colors hover:text-primary">
            Produits
          </Link>
          <Link to="/categories" className="text-sm font-medium transition-colors hover:text-primary">
            Catégories
          </Link>
          <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
            À Propos
          </Link>
          <Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>

        {/* Right Icons - dans l'ordre spécifié */}
        <div className="flex items-center space-x-1 md:space-x-2 ml-auto">
          <Button variant="ghost" size="icon" onClick={toggleSearch} className="hidden sm:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Recherche</span>
          </Button>
          
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {/* Favorites */}
          <Link to="/favorites" className="relative">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
              {favoriteQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoriteQuantity}
                </span>
              )}
              <span className="sr-only">Favoris</span>
            </Button>
          </Link>
          
          {/* Cart */}
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartQuantity}
                </span>
              )}
              <span className="sr-only">Panier</span>
            </Button>
          </Link>

          <Link to="/account" className="hidden sm:block">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Compte</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/90 backdrop-blur-md z-50"
          >
            <div className="container py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Rechercher des produits</h2>
                <Button variant="ghost" size="icon" onClick={toggleSearch}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Fermer</span>
                </Button>
              </div>
              <form onSubmit={handleSearchSubmit}>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Rechercher des produits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button type="submit">Rechercher</Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar for mobile navigation */}
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </header>
  );
};

export default Header;
