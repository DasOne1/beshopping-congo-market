
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Product } from '@/types';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ProductCard = ({ product, viewMode = 'grid' }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { t } = useTranslation();

  const isFavorite = favorites.some(fav => fav.id === product.id);
  const isListView = viewMode === 'list';

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, 1);
  };

  const getOrderButtonText = () => {
    if (product.status !== 'active') {
      return t('product.customOrder');
    }
    if (product.stock === 0) {
      return t('product.customOrder');
    }
    return t('product.addToCart');
  };

  const getStockStatus = () => {
    if (product.status !== 'active') {
      return t('product.inactive');
    }
    if (product.stock === 0) {
      return t('product.outOfStock');
    }
    return t('product.inStock');
  };

  const getStockBadgeVariant = () => {
    if (product.status !== 'active' || product.stock === 0) {
      return 'destructive';
    }
    return 'secondary';
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
      isListView ? "flex flex-row" : "flex flex-col"
    )}>
      {/* Product Image */}
      <div className={cn(
        "relative overflow-hidden bg-gray-100",
        isListView ? "w-48 h-32 flex-shrink-0" : "aspect-square"
      )}>
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && (
            <Badge variant="default" className="text-xs">
              {t('product.featured')}
            </Badge>
          )}
          <Badge variant={getStockBadgeVariant()} className="text-xs">
            {getStockStatus()}
          </Badge>
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white transition-colors"
          onClick={handleToggleFavorite}
        >
          <Heart className={cn(
            "h-4 w-4 transition-colors",
            isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
          )} />
        </Button>
      </div>

      {/* Product Details */}
      <CardContent className={cn(
        "flex flex-col",
        isListView ? "flex-1 p-4" : "p-4"
      )}>
        <div className="flex-1">
          <Link 
            to={`/product/${product.id}`}
            className="group-hover:text-primary transition-colors"
          >
            <h3 className={cn(
              "font-medium line-clamp-2 mb-1",
              isListView ? "text-base" : "text-sm"
            )}>
              {product.name}
            </h3>
          </Link>
          
          {product.description && (
            <p className={cn(
              "text-gray-600 line-clamp-2 mb-2",
              isListView ? "text-sm" : "text-xs"
            )}>
              {product.description}
            </p>
          )}
        </div>

        <div className={cn(
          "flex items-center justify-between mt-auto",
          isListView ? "flex-row" : "flex-col gap-2"
        )}>
          <div className="text-lg font-bold text-primary">
            ${product.original_price?.toFixed(2)}
          </div>
          
          <Button 
            onClick={handleAddToCart}
            size={isListView ? "sm" : "sm"}
            className={cn(
              "transition-all",
              isListView ? "px-4" : "w-full"
            )}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {getOrderButtonText()}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
