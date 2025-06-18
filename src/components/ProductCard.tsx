
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Package, Palette, Ruler } from 'lucide-react';
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
  showAllAttributes?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  viewMode = 'grid', 
  showAllAttributes = false 
}) => {
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
  const isOutOfStock = product.status === 'inactive' || product.stock <= 0;

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
          
          {/* Featured badge */}
          {product.featured && (
            <Badge className="absolute top-2 right-12 bg-yellow-500 text-white z-10">
              Vedette
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

          {/* SKU et marque si disponibles */}
          {showAllAttributes && (
            <div className="mb-2 space-y-1">
              {product.sku && (
                <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
              )}
              {product.brand && (
                <p className="text-xs text-muted-foreground">Marque: {product.brand}</p>
              )}
              {product.collection && (
                <p className="text-xs text-muted-foreground">Collection: {product.collection}</p>
              )}
            </div>
          )}

          {/* Attributs supplémentaires */}
          {showAllAttributes && (
            <div className="mb-2 flex flex-wrap gap-1">
              {product.colors && product.colors.length > 0 && (
                <div className="flex items-center gap-1">
                  <Palette className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {product.colors.join(', ')}
                  </span>
                </div>
              )}
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex items-center gap-1">
                  <Ruler className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {product.sizes.join(', ')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Poids et dimensions si disponibles */}
          {showAllAttributes && (product.weight || product.dimensions) && (
            <div className="mb-2 text-xs text-muted-foreground">
              {product.weight && <span>Poids: {product.weight}g</span>}
              {product.weight && product.dimensions && <span> • </span>}
              {product.dimensions && <span>Dim: {product.dimensions}</span>}
            </div>
          )}

          {/* Matériau et genre */}
          {showAllAttributes && (product.material || product.gender) && (
            <div className="mb-2 text-xs text-muted-foreground">
              {product.material && <span>Matériau: {product.material}</span>}
              {product.material && product.gender && <span> • </span>}
              {product.gender && <span>Genre: {product.gender}</span>}
            </div>
          )}

          {/* Saison */}
          {showAllAttributes && product.season && (
            <div className="mb-2">
              <Badge variant="outline" className="text-xs">
                {product.season}
              </Badge>
            </div>
          )}
          
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
            
            {/* Stock et status */}
            <div className="flex items-center gap-2">
              {showAllAttributes && (
                <div className="flex items-center gap-1">
                  <Package className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{product.stock}</span>
                </div>
              )}
              <Badge 
                variant={isOutOfStock ? "secondary" : "default"}
                className="text-xs"
              >
                {isOutOfStock ? 'Hors stock' : 'En stock'}
              </Badge>
            </div>
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

            {/* Tags si affichage complet */}
            {showAllAttributes && product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {product.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {product.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
            
            <Button 
              onClick={handleAddToCart}
              disabled={isInCart(product.id) || isOutOfStock}
              className="w-full h-8 text-xs"
              variant={isOutOfStock ? "secondary" : "default"}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              {isInCart(product.id) ? 'Dans le panier' : isOutOfStock ? 'Non disponible' : 'Ajouter'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
