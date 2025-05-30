
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

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list' | 'single';
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

  const cardClasses = viewMode === 'single' 
    ? "w-full max-w-sm mx-auto" 
    : viewMode === 'list' 
    ? "w-full" 
    : "w-full";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cardClasses}
    >
      <Card className="group relative overflow-hidden border border-border/40 hover:border-border/80 hover:shadow-lg transition-all duration-300 bg-card">
        <div className="relative">
          <Link to={`/product/${product.id}`}>
            <div className="aspect-square overflow-hidden bg-muted">
              <img 
                src={product.images?.[0] || '/placeholder.svg'} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>
          
          {/* Discount badge */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              -{discountPercentage}%
            </Badge>
          )}
          
          {/* Favorite button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background"
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
          
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3 w-3 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {product.discounted_price ? (
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
