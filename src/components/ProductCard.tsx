
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn("group cursor-pointer w-full", className)}
      onClick={handleProductClick}
    >
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-card h-[420px] flex flex-col">
        {/* Image principale avec header overlay */}
        <div className="relative flex-1 overflow-hidden bg-muted/50">
          {/* Header overlay */}
          <div className="absolute top-0 left-0 right-0 z-20 p-3 bg-gradient-to-b from-black/20 to-transparent">
            <div className="flex justify-between items-start">
              <div className="flex gap-2">
                {hasDiscount && (
                  <Badge className="bg-red-500 hover:bg-red-600 text-xs">
                    -{product.discount}%
                  </Badge>
                )}
                {product.featured && (
                  <Badge className="bg-primary text-xs">
                    Vedette
                  </Badge>
                )}
              </div>
              <Button
                size="sm"
                onClick={handleToggleFavorite}
                variant="ghost"
                className={`h-6 w-6 p-0 bg-white/80 hover:bg-white ${
                  isFavorite ? 'text-red-500' : 'text-gray-600'
                }`}
              >
                <Heart className={`h-3 w-3 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Image principale */}
          <div className="aspect-square">
            <img
              src={product.images[selectedImageIndex] || '/placeholder.svg'}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Navigation des images si plusieurs images */}
          {hasMultipleImages && viewMode !== 'list' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Thumbnails superposées sur l'image principale */}
          {hasMultipleImages && viewMode !== 'list' && (
            <div className="absolute bottom-2 left-2 right-2 z-10">
              <div className="flex gap-1 justify-center">
                {product.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleThumbnailClick(e, index)}
                    className={cn(
                      "w-10 h-10 rounded-md overflow-hidden border-2 transition-all flex-shrink-0",
                      selectedImageIndex === index 
                        ? "border-white shadow-lg scale-110" 
                        : "border-white/50 hover:border-white/80"
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
        </div>

        {/* Footer compact */}
        <CardFooter className="p-3">
          <div className="w-full space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">4.5</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.popular || 0} ventes)
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
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
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
