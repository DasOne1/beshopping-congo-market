
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
import { useProducts } from '@/hooks/useProducts';
import Sidebar from './Sidebar';

const Header = () => {
  const { getTotalQuantity } = useCart();
  const { favorites } = useFavorites();
  const { products } = useProducts();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setShowResults(false);
    }
  };

  // Recherche en temps réel
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5); // Limiter à 5 résultats
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery, products]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setShowResults(false);
    }
  };

  const handleProductSelect = (productId: string) => {
    navigate(`/product/${productId}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setShowResults(false);
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

      {/* Search Overlay Professional */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-background/98 backdrop-blur-lg border-b shadow-xl z-50"
          >
            <div className="container py-8">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Rechercher des produits</h2>
                  <Button variant="ghost" size="icon" onClick={toggleSearch} className="hover:bg-muted">
                    <X className="h-6 w-6" />
                    <span className="sr-only">Fermer</span>
                  </Button>
                </div>
                
                <form onSubmit={handleSearchSubmit} className="relative">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher des produits, catégories, marques..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-24 h-14 text-lg rounded-xl border-2 focus:border-primary shadow-lg bg-background"
                      autoFocus
                    />
                    <Button 
                      type="submit" 
                      size="lg"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg px-6"
                    >
                      Rechercher
                    </Button>
                  </div>
                </form>

                {/* Résultats de recherche en temps réel */}
                <AnimatePresence>
                  {showResults && searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-6 bg-card rounded-xl border shadow-lg overflow-hidden"
                    >
                      <div className="p-4 border-b bg-muted/50">
                        <h3 className="font-semibold text-foreground">Résultats trouvés</h3>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {searchResults.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleProductSelect(product.id)}
                            className="flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors border-b last:border-b-0"
                          >
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                              {product.images && product.images.length > 0 ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <Search className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate">{product.name}</h4>
                              <p className="text-sm text-muted-foreground truncate">{product.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-lg font-bold text-primary">
                                  {(product.discounted_price || product.original_price).toLocaleString()} FC
                                </span>
                                {product.discounted_price && (
                                  <span className="text-sm text-muted-foreground line-through">
                                    {product.original_price.toLocaleString()} FC
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-muted/30 border-t">
                        <Button 
                          onClick={handleSearchSubmit}
                          variant="outline" 
                          className="w-full"
                        >
                          Voir tous les résultats pour "{searchQuery}"
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {showResults && searchResults.length === 0 && searchQuery.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-center py-8"
                  >
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Aucun résultat trouvé</h3>
                    <p className="text-muted-foreground">
                      Essayez avec d'autres mots-clés ou explorez nos catégories
                    </p>
                  </motion.div>
                )}

                {!searchQuery.trim() && (
                  <div className="mt-6 text-center py-4">
                    <p className="text-muted-foreground">
                      Commencez à taper pour voir les suggestions de produits
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
