
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Product } from '@/types';
import ProductImageCarousel from './ProductImageCarousel';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const { addToCart, isInCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id, 1);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product.id);
    }
  };

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const discountPercentage = product.discounted_price 
    ? Math.round(((product.original_price - product.discounted_price) / product.original_price) * 100)
    : 0;

  const cardClasses = viewMode === 'list' ? "w-full" : "w-full";
  const isOutOfStock = product.status === 'inactive';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cardClasses}
    >
      <Card className={`group relative overflow-hidden border border-border/40 hover:border-border/80 hover:shadow-lg transition-all duration-300 bg-card ${isOutOfStock ? 'opacity-75' : ''}`}>
        <div className="relative">
          <Link to={`/product/${product.id}`}>
            <ProductImageCarousel
              images={product.images || []}
              productName={product.name}
              className="w-full"
            />
          </Link>
          
          {/* Discount badge */}
          {discountPercentage > 0 && !isOutOfStock && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">
              -{discountPercentage}%
            </Badge>
          )}
          
          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
              <Badge variant="secondary" className="bg-gray-600 text-white">
                Hors stock
              </Badge>
            </div>
          )}
          
          {/* Favorite button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background z-10"
            onClick={handleToggleFavorite}
          >
            <Heart 
              className={`h-4 w-4 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
            />
          </Button>
        </div>
        
        <CardContent className="p-3">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-sm line-clamp-2 mb-2 text-foreground hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                />
              ))}
              <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
            </div>
            
            {/* Status badge on the same line as rating */}
            <Badge 
              variant={isOutOfStock ? "secondary" : "default"}
              className="text-xs"
            >
              {isOutOfStock ? 'Hors stock' : 'En stock'}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {product.discounted_price && !isOutOfStock ? (
                <>
                  <span className="font-bold text-primary text-sm">
                    {formatPrice(product.discounted_price)} FC
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.original_price)} FC
                  </span>
                </>
              ) : (
                <span className="font-bold text-primary text-sm">
                  {formatPrice(product.original_price)} FC
                </span>
              )}
            </div>
            
            <Button 
              onClick={handleAddToCart}
              disabled={isInCart(product.id)}
              className="w-full h-8 text-xs"
              variant={isOutOfStock ? "secondary" : "default"}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              {isInCart(product.id) ? 'Dans le panier' : 'Ajouter'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
