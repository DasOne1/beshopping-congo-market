import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  viewMode?: 'single' | 'grid';
}

const ProductCard = ({ product, viewMode = 'single' }: ProductCardProps) => {
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Check if product is in favorites by comparing IDs
  const isInFavorites = Array.isArray(favorites) ? 
    favorites.some(fav => (typeof fav === 'string' ? fav : fav.id) === product.id) :
    false;
  
  // Calculate actual number of likes from favorites - count occurrences of this product ID
  const likesCount = Array.isArray(favorites) ? 
    favorites.filter(fav => (typeof fav === 'string' ? fav : fav.id) === product.id).length :
    0;

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInFavorites) {
      // Remove from favorites using product ID
      removeFromFavorites(product.id);
    } else {
      // Add to favorites using the product object
      addToFavorites(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const nextImage = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (product.images && product.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && product.images && product.images.length > 1) {
      nextImage();
    }
    if (isRightSwipe && product.images && product.images.length > 1) {
      prevImage();
    }
  };

  // Auto-cycle images on hover (optional)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isHovered && product.images && product.images.length > 1) {
      interval = setInterval(() => {
        nextImage();
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isHovered, product.images]);

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const discountPercentage = product.discounted_price 
    ? Math.round(((product.original_price - product.discounted_price) / product.original_price) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-card rounded-xl shadow-sm border border-border overflow-hidden transition-all duration-300 hover:shadow-lg group ${
        viewMode === 'grid' ? 'max-w-sm' : 'w-full'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-muted/50">
          <div 
            className="relative aspect-square overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={product.images?.[currentImageIndex] || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
            
            {/* Image Navigation Arrows */}
            {product.images && product.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image Indicators */}
            {product.images && product.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setCurrentImageIndex(index);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.featured && (
                <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                  <Star className="w-3 h-3 mr-1" />
                  Vedette
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="bg-red-500/90">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <Badge variant="outline" className="bg-orange-500/90 text-white border-orange-500">
                  Stock limité
                </Badge>
              )}
              {product.stock === 0 && (
                <Badge variant="outline" className="bg-gray-500/90 text-white border-gray-500">
                  Rupture
                </Badge>
              )}
            </div>

            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 backdrop-blur-sm"
              onClick={handleFavoriteToggle}
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  isInFavorites ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground line-clamp-2 leading-tight">
              {product.name}
            </h3>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">
                    {formatPrice(product.discounted_price || product.original_price)} FC
                  </span>
                  {product.discounted_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.original_price)} FC
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-500" />
                    <span className="text-xs text-muted-foreground">
                      {likesCount}
                    </span>
                  </div>
                  {product.popular && product.popular > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-muted-foreground">
                        {product.popular}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="shrink-0"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                {product.stock === 0 ? 'Rupture' : 'Ajouter'}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
