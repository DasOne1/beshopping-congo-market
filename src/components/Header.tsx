
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
      <div className="container flex h-14 md:h-16 items-center justify-between">
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
        <Link to="/" className="flex items-center space-x-2">
          <Logo size="small" asLink />
          <span className="text-lg font-bold text-primary hidden sm:inline-block">BeShop</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/products" className="text-sm font-medium transition-colors hover:text-primary">
            Products
          </Link>
          <Link to="/categories" className="text-sm font-medium transition-colors hover:text-primary">
            Categories
          </Link>
          <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
            About Us
          </Link>
          <Link to="/contact" className="text-sm font-medium transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>

        {/* Right Icons */}
        <div className="flex items-center space-x-1 md:space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleSearch} className="hidden sm:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          <ThemeToggle />
          
          <Link to="/favorites" className="relative">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
              {favoriteQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favoriteQuantity}
                </span>
              )}
              <span className="sr-only">Favorites</span>
            </Button>
          </Link>
          
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartQuantity}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          <Link to="/account" className="hidden sm:block">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
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
                <h2 className="text-lg font-medium">Search products</h2>
                <Button variant="ghost" size="icon" onClick={toggleSearch}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
              <form onSubmit={handleSearchSubmit}>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button type="submit">Search</Button>
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
