
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const cartQuantity = getTotalQuantity();
  const favoriteQuantity = favorites.length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-background/95 shadow-sm backdrop-blur-md border-b border-border/40">
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
            <Link to="/">
              <img src="/shopping_logo.png" alt="BeShopping Logo" className="h-10 w-10" />
            </Link>
            <Link to="/" className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                BeShopping
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
          <Button variant="ghost" size="icon" onClick={toggleSearch}>
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-background/98 backdrop-blur-md border-b shadow-lg z-50"
          >
            <div className="container py-6">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Rechercher des produits</h2>
                  <Button variant="ghost" size="icon" onClick={toggleSearch}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Fermer</span>
                  </Button>
                </div>
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher des produits, catégories, marques..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-20 h-12 text-base rounded-lg border-2 focus:border-primary"
                      autoFocus
                    />
                    <Button 
                      type="submit" 
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      Rechercher
                    </Button>
                  </div>
                </form>
                {searchQuery && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">
                      Appuyez sur Entrée ou cliquez sur Rechercher pour voir les résultats pour "{searchQuery}"
                    </p>
                  </div>
                )}
              </div>
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
