import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Search, ShoppingBag, Heart, User, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileNavBar } from '@/components/MobileNavBar';
import { NavLink } from '@/components/NavLink';

import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { favorites } = useFavorites();

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchTerm('');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
    console.log('Searching for:', searchTerm);
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

          {/* Search Bar - Displays when isSearchOpen is true */}
          {isSearchOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-background shadow-md p-4 border-b z-20"
            >
              <form onSubmit={handleSearch} className="flex items-center">
                <Input 
                  type="search"
                  placeholder="Rechercher des produits..."
                  className="flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  autoFocus
                />
                <Button type="submit" variant="ghost" className="ml-2">
                  <Search className="h-5 w-5" />
                </Button>
                <Button type="button" variant="ghost" className="ml-1" onClick={closeSearch}>
                  <X className="h-5 w-5" />
                </Button>
              </form>
            </motion.div>
          )}

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

      {/* Mobile Navigation */}
      <MobileNavBar isOpen={isMobileMenuOpen} closeMenu={closeMobileMenu} />
    </header>
  );
};

export default Header;
