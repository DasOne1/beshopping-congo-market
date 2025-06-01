
import React, { useState, useEffect } from 'react';
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
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Redirection automatique lors de la saisie
  useEffect(() => {
    if (searchQuery.trim() && isSearchOpen) {
      const timeoutId = setTimeout(() => {
        navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearchOpen(false);
        setSearchQuery('');
      }, 500); // Délai de 500ms pour éviter trop de requêtes

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, navigate, isSearchOpen]);

  const cartQuantity = getTotalQuantity();
  const favoriteQuantity = favorites.length;

  return (
    <>
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
      </header>

      {/* Search Bar Overlay - au même niveau que le header */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-14 md:top-16 left-0 right-0 bg-background/98 backdrop-blur-lg border-b shadow-lg z-40"
          >
            <div className="container py-4">
              <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher des produits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-12 h-12 text-base rounded-lg border-2 focus:border-primary shadow-sm bg-background"
                    autoFocus
                  />
                  <Button 
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={toggleSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    {searchQuery.trim() ? 'Appuyez sur Entrée ou attendez pour voir les résultats' : 'Commencez à taper pour rechercher...'}
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar for mobile navigation */}
      <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
