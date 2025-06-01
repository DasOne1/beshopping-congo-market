import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Search, ShoppingBag, Heart, User, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NavLink } from '@/components/NavLink';

import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

const Header = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const { favorites } = useFavorites();

  const totalItems = cart?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
      closeSearch();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-30 bg-background/80 backdrop-blur-md shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" aria-label="Accueil">
              <Logo className="h-8 md:h-9 text-primary" />
              <span className="font-bold text-lg md:text-xl ml-2">BeShopping</span>
            </Link>
          </div>

          {/* Navigation - Hidden on Mobile */}
          <nav className="hidden md:flex items-center space-x-6 text-sm">
            <NavLink to="/">Accueil</NavLink>
            <NavLink to="/products">Produits</NavLink>
            <NavLink to="/categories">Catégories</NavLink>
            <NavLink to="/about">À propos</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleSearch} aria-label="Rechercher">
              <Search className="h-5 w-5" />
            </Button>

            <Link to="/favorites" className="relative" aria-label="Favoris">
              <Button variant="ghost" size="icon" className="relative">
                <Heart className="h-5 w-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </Link>

            <Link to="/cart" className="relative" aria-label="Panier">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            <Link to="/account" aria-label="Mon compte">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <ThemeToggle />

            {/* Mobile Menu Button */}
            <div className="block md:hidden">
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Menu">
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar Overlay - Compact version */}
      {isSearchOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-lg border-b z-20"
        >
          <div className="container mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="flex items-center max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="search"
                  placeholder="Rechercher des produits..."
                  className="pl-10 pr-4 h-10 border-primary/20 focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  autoFocus
                />
              </div>
              <Button type="button" variant="ghost" size="icon" className="ml-2 h-10 w-10" onClick={closeSearch}>
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </motion.div>
      )}

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-y-0 left-0 z-40 w-64 bg-background shadow-lg md:hidden"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <Logo className="h-8 text-primary" />
              <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <nav className="flex-1 p-4 space-y-4">
              <NavLink to="/" className="block py-2">Accueil</NavLink>
              <NavLink to="/products" className="block py-2">Produits</NavLink>
              <NavLink to="/categories" className="block py-2">Catégories</NavLink>
              <NavLink to="/about" className="block py-2">À propos</NavLink>
              <NavLink to="/contact" className="block py-2">Contact</NavLink>
            </nav>
          </div>
        </motion.div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </header>
  );
};

export default Header;
