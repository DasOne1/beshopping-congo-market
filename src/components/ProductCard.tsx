
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/hooks/useProducts';
import ProductImageCarousel from './ProductImageCarousel';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ProductCard = ({ product, viewMode = 'grid' }: ProductCardProps) => {
  const navigate = useNavigate();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  
  const isFavorite = favorites.some(fav => fav.id === product.id);
  const displayPrice = product.discounted_price || product.original_price;
  const hasDiscount = product.discounted_price && product.discounted_price < product.original_price;

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex p-4">
          <div className="w-32 h-32 flex-shrink-0">
            <ProductImageCarousel 
              images={product.images || []} 
              productName={product.name}
              className="w-full h-full"
            />
          </div>
          
          <div className="flex-1 ml-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                {product.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className={`ml-2 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {displayPrice} FC
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      {product.original_price} FC
                    </span>
                    {product.discount && (
                      <Badge variant="destructive" className="text-xs">
                        -{product.discount}%
                      </Badge>
                    )}
                  </>
                )}
              </div>
              
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <ProductImageCarousel 
          images={product.images || []} 
          productName={product.name}
          className="aspect-square"
        />
        
        {hasDiscount && product.discount && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            -{product.discount}%
          </Badge>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleFavorite}
          className={`absolute top-2 right-2 bg-white/80 hover:bg-white/90 ${
            isFavorite ? 'text-red-500' : 'text-gray-600'
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {displayPrice} FC
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {product.original_price} FC
              </span>
            )}
          </div>
        </div>
        
        <Button
          size="sm"
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter au panier
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
