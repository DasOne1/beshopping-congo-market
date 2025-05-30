
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Product } from '@/hooks/useProducts';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
  viewMode?: 'grid' | 'single' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const formatPrice = (price: number | undefined | null): string => {
    if (!price && price !== 0) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const currentPrice = product.discounted_price || product.original_price || 0;
  const originalPrice = product.original_price || 0;
  const hasDiscount = product.discounted_price && product.discounted_price < originalPrice;
  const isFavorite = favorites.includes(product.id);
  const hasMultipleImages = product.images && product.images.length > 1;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product.id);
    }
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleThumbnailClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setSelectedImageIndex(index);
  };

  // Mode single pour la page d'accueil
  if (viewMode === 'single') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={cn("group cursor-pointer w-full", className)}
        onClick={handleProductClick}
      >
        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-card">
          <div className="flex gap-4 p-4">
            {/* Image */}
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden bg-muted/50 rounded-lg">
              <img
                src={product.images[selectedImageIndex] || '/placeholder.svg'}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {hasDiscount && (
                <Badge className="absolute top-1 left-1 bg-red-500 hover:bg-red-600 text-xs">
                  -{product.discount}%
                </Badge>
              )}
              
              {product.featured && (
                <Badge className="absolute top-1 right-1 bg-primary text-xs">
                  Vedette
                </Badge>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <Button
                  size="sm"
                  onClick={handleToggleFavorite}
                  variant="ghost"
                  className={`h-6 w-6 p-0 ml-2 ${
                    isFavorite ? 'text-red-500' : 'text-gray-600'
                  }`}
                >
                  <Heart className={`h-3 w-3 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">4.5</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.popular || 0} ventes)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary text-sm">
                      {formatPrice(currentPrice)} FC
                    </span>
                    {hasDiscount && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(originalPrice)} FC
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="h-7 px-3"
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  {product.stock === 0 ? 'Rupture' : 'Ajouter'}
                </Button>
              </div>

              {product.stock <= 5 && product.stock > 0 && (
                <Badge variant="outline" className="text-xs w-fit">
                  Plus que {product.stock} en stock
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnails pour images multiples */}
          {hasMultipleImages && (
            <div className="px-4 pb-4">
              <div className="flex gap-2 overflow-x-auto">
                {product.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleThumbnailClick(e, index)}
                    className={cn(
                      "w-12 h-12 rounded-md overflow-hidden border-2 transition-all flex-shrink-0",
                      selectedImageIndex === index 
                        ? "border-primary shadow-md" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    );
  }

  // Mode grid normal pour les autres cas
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn("group cursor-pointer w-full", className)}
      onClick={handleProductClick}
    >
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-card h-full">
        <div className="relative aspect-square overflow-hidden bg-muted/50">
          <img
            src={product.images[selectedImageIndex] || '/placeholder.svg'}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
              -{product.discount}%
            </Badge>
          )}
          
          {product.featured && (
            <Badge className="absolute top-2 right-2 bg-primary">
              Vedette
            </Badge>
          )}

          <Button
            size="sm"
            onClick={handleToggleFavorite}
            variant="ghost"
            className={`absolute top-2 right-2 ${product.featured ? 'right-20' : ''} h-8 w-8 p-0 bg-white/80 hover:bg-white/90 ${
              isFavorite ? 'text-red-500' : 'text-gray-600'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <CardContent className="p-3 md:p-4 flex-1 flex flex-col">
          <div className="space-y-2 flex-1">
            <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            <p className="text-xs text-muted-foreground line-clamp-2 hidden md:block">
              {product.description}
            </p>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">4.5</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.popular || 0} ventes)
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary text-sm md:text-base">
                    {formatPrice(currentPrice)} FC
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(originalPrice)} FC
                    </span>
                  )}
                </div>
              </div>

              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="h-8 px-3 w-full"
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                {product.stock === 0 ? 'Rupture' : 'Ajouter'}
              </Button>
            </div>

            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="outline" className="text-xs w-fit">
                Plus que {product.stock} en stock
              </Badge>
            )}
          </div>
        </CardContent>

        {/* Thumbnails pour images multiples - seulement en mode grid */}
        {hasMultipleImages && viewMode !== 'list' && (
          <div className="px-3 pb-3">
            <div className="flex gap-1 overflow-x-auto">
              {product.images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => handleThumbnailClick(e, index)}
                  className={cn(
                    "w-8 h-8 rounded-md overflow-hidden border transition-all flex-shrink-0",
                    selectedImageIndex === index 
                      ? "border-primary shadow-md" 
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ProductCard;
