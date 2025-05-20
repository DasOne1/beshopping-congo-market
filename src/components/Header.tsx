
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
import { cn } from '@/lib/utils';

const Header = () => {
  const { getTotalQuantity } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search query
    console.log('Search for:', searchQuery);
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={toggleMenu}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">BeShop</span>
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
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleSearch}>
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          
          <Link to="/favorites">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
              <span className="sr-only">Favorites</span>
            </Button>
          </Link>
          
          <Link to="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
              {getTotalQuantity() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalQuantity()}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>

          <Link to="/account">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity z-50",
          isSearchOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
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
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-background z-50 transition-transform transform md:hidden",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">BeShop</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/" 
                  className="block py-2 text-lg font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="block py-2 text-lg font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories" 
                  className="block py-2 text-lg font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="block py-2 text-lg font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="block py-2 text-lg font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/account" 
                  className="block py-2 text-lg font-medium hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Account
                </Link>
              </li>
            </ul>
          </nav>
          <div className="p-4 border-t">
            <Button asChild className="w-full" variant="outline">
              <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
                Contact via WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
