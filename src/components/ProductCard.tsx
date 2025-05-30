
import React, { useState, useRef } from 'react';
import { Heart, ShoppingCart, Eye, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Product } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list' | 'single';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Calculate real favorite count based on how many users have favorited this product
  const favoriteCount = favorites.filter(favId => favId === product.id).length;

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.discounted_price || product.original_price,
      image: product.images[0],
      quantity: 1
    });
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product.id);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const selectImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  const toggleMainImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
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

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (product.images.length <= 1) return;

    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swipe left - next image
        nextImage();
      } else {
        // Swipe right - previous image
        prevImage();
      }
    }
  };

  if (viewMode === 'single') {
    return (
      <Card 
        className="w-full hover:shadow-lg transition-all duration-300 cursor-pointer group bg-card border border-border/50 hover:border-primary/20"
        onClick={handleViewDetails}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="relative w-full md:w-64 h-48 md:h-32">
            {/* Header elements overlay */}
            <div className="absolute top-2 left-2 right-2 z-20 flex justify-between items-start">
              {product.discount && product.discount > 0 && (
                <Badge className="bg-destructive text-destructive-foreground">
                  -{product.discount}%
                </Badge>
              )}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
                  onClick={handleFavoriteToggle}
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      isFavorite(product.id) 
                        ? 'fill-red-500 text-red-500' 
                        : 'text-muted-foreground hover:text-red-500'
                    }`} 
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
                  onClick={handleViewDetails}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Main Image */}
            <div 
              className="relative w-full h-full overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={product.images[currentImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                onClick={toggleMainImage}
              />
              
              {/* Navigation arrows for main image */}
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-background/80 hover:bg-background/90 backdrop-blur-sm z-10"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-background/80 hover:bg-background/90 backdrop-blur-sm z-10"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Thumbnail images overlaid on main image */}
              {product.images.length > 1 && (
                <div className="absolute bottom-2 left-2 flex gap-1 z-10">
                  {product.images.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded border-2 overflow-hidden cursor-pointer transition-all ${
                        index === currentImageIndex 
                          ? 'border-primary shadow-lg' 
                          : 'border-white/60 hover:border-white'
                      }`}
                      onClick={(e) => selectImage(index, e)}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {product.images.length > 4 && (
                    <div className="w-8 h-8 rounded border-2 border-white/60 bg-background/80 flex items-center justify-center">
                      <span className="text-xs text-foreground">+{product.images.length - 4}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <CardContent className="p-4 flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(product.discounted_price || product.original_price)} FC
                  </span>
                  {product.discounted_price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.original_price)} FC
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>{favoriteCount}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.5</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              size="sm"
              className="w-full mt-3"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Ajouter au panier
            </Button>
          </CardContent>
        </div>
      </Card>
    );
  }

  // Regular grid/list view
  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer bg-card border border-border/50 hover:border-primary/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      {/* Header elements overlay */}
      <div className="absolute top-2 left-2 right-2 z-20 flex justify-between items-start">
        {product.discount && product.discount > 0 && (
          <Badge className="bg-destructive text-destructive-foreground">
            -{product.discount}%
          </Badge>
        )}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
            onClick={handleFavoriteToggle}
          >
            <Heart 
              className={`h-4 w-4 ${
                isFavorite(product.id) 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-muted-foreground hover:text-red-500'
              }`} 
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-background/80 hover:bg-background/90 backdrop-blur-sm"
            onClick={handleViewDetails}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Image */}
      <div 
        className="relative aspect-square overflow-hidden rounded-t-lg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={product.images[currentImageIndex] || product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
          onClick={toggleMainImage}
        />
        
        {/* Navigation arrows for main image */}
        {product.images.length > 1 && isHovered && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-background/80 hover:bg-background/90 backdrop-blur-sm z-10"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 bg-background/80 hover:bg-background/90 backdrop-blur-sm z-10"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Thumbnail images overlaid on main image */}
        {product.images.length > 1 && (
          <div className="absolute bottom-2 left-2 flex gap-1 z-10">
            {product.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded border-2 overflow-hidden cursor-pointer transition-all ${
                  index === currentImageIndex 
                    ? 'border-primary shadow-lg' 
                    : 'border-white/60 hover:border-white'
                }`}
                onClick={(e) => selectImage(index, e)}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {product.images.length > 4 && (
              <div className="w-8 h-8 rounded border-2 border-white/60 bg-background/80 flex items-center justify-center">
                <span className="text-xs text-foreground">+{product.images.length - 4}</span>
              </div>
            )}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.discounted_price || product.original_price)} FC
            </span>
            {product.discounted_price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.original_price)} FC
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{favoriteCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.5</span>
            </div>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          size="sm"
          className="w-full mt-3"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Ajouter
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
