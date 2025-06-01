
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
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useProducts } from '@/hooks/useProducts';
import Sidebar from './Sidebar';

const Header = () => {
  const { getTotalQuantity } = useCart();
  const { favorites } = useFavorites();
  const { products } = useProducts();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Générer des suggestions basées sur la requête de recherche
  useEffect(() => {
    if (searchQuery.trim() && searchQuery.length > 1) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6); // Limiter à 6 suggestions

      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setShowSuggestions(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSuggestionClick = (product: any) => {
    setSearchQuery(product.name);
    navigate(`/products?search=${encodeURIComponent(product.name)}`);
    setIsSearchOpen(false);
    setShowSuggestions(false);
  };

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

      {/* Overlay avec effet de flou */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={toggleSearch}
          />
        )}
      </AnimatePresence>

      {/* Search Bar avec suggestions */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-14 md:top-16 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40 shadow-lg"
          >
            <div className="container py-4">
              <form onSubmit={handleSearchSubmit} className="relative max-w-md mx-auto">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher des produits..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-10 pr-4"
                      autoFocus
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={toggleSearch}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Fermer</span>
                  </Button>
                </div>

                {/* Suggestions */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-md shadow-lg z-10"
                    >
                      {suggestions.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => handleSuggestionClick(product)}
                          className="flex items-center p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden bg-muted flex-shrink-0 mr-3">
                            {product.images && product.images.length > 0 ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Search className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {product.discounted_price ? product.discounted_price : product.original_price} €
                            </p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
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
