
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
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
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const formatPrice = (price: number | undefined | null): string => {
    if (!price && price !== 0) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const currentPrice = product.discounted_price || product.original_price || product.originalPrice || 0;
  const originalPrice = product.original_price || product.originalPrice || 0;
  const hasDiscount = product.discounted_price && product.discounted_price < originalPrice;
  const isFavorite = favorites.some(fav => fav.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: currentPrice,
      image: product.images[0] || '/placeholder.svg',
      quantity: 1
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites({
        id: product.id,
        name: product.name,
        price: currentPrice,
        image: product.images[0] || '/placeholder.svg'
      });
    }
  };

  const handleViewProduct = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn("group", className)}
    >
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.images[0] || '/placeholder.svg'}
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

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleViewProduct}
              className="opacity-90 hover:opacity-100"
            >
              <Eye className="h-4 w-4 mr-1" />
              Voir
            </Button>
            <Button
              size="sm"
              onClick={handleToggleFavorite}
              variant={isFavorite ? "default" : "secondary"}
              className="opacity-90 hover:opacity-100"
            >
              <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            <p className="text-xs text-muted-foreground line-clamp-2">
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

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">
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
                className="h-8 px-3"
              >
                <ShoppingCart className="h-3 w-3 mr-1" />
                {product.stock === 0 ? 'Rupture' : 'Ajouter'}
              </Button>
            </div>

            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="outline" className="text-xs">
                Plus que {product.stock} en stock
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
