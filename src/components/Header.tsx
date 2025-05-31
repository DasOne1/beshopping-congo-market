
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
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const { getTotalQuantity } = useCart();
  const { favorites } = useFavorites();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search for:', searchQuery);
    setIsSearchOpen(false);
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
              <img src="/favicon.svg" alt="BeShopping Logo" className="h-10 w-10" />
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
            {t('header.home')}
          </Link>
          <Link to="/products" className="text-sm font-medium transition-colors hover:text-primary">
            {t('header.products')}
          </Link>
          <Link to="/categories" className="text-sm font-medium transition-colors hover:text-primary">
            {t('header.categories')}
          </Link>
          <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
            {t('header.about')}
          </Link>
          <Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
            {t('header.contact')}
          </Link>
        </nav>

        {/* Right Icons - dans l'ordre spécifié */}
        <div className="flex items-center space-x-1 md:space-x-2 ml-auto">
          <Button variant="ghost" size="icon" onClick={toggleSearch} className="hidden sm:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">{t('header.search')}</span>
          </Button>
          
          {/* Language Selector */}
          <LanguageSelector />
          
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
              <span className="sr-only">{t('header.favorites')}</span>
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
              <span className="sr-only">{t('header.cart')}</span>
            </Button>
          </Link>

          <Link to="/account" className="hidden sm:block">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">{t('header.account')}</span>
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
                <h2 className="text-lg font-medium">{t('header.search')}</h2>
                <Button variant="ghost" size="icon" onClick={toggleSearch}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Fermer</span>
                </Button>
              </div>
              <form onSubmit={handleSearchSubmit}>
                <div className="flex space-x-2">
                  <Input
                    placeholder={t('header.search')}
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
