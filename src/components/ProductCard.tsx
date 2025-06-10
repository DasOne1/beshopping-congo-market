
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { toast } from '@/components/ui/use-toast';
import { Product } from '@/store/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier`,
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
      toast({
        title: "Retiré des favoris",
        description: `${product.name} a été retiré de vos favoris`,
      });
    } else {
      addToFavorites(product);
      toast({
        title: "Ajouté aux favoris",
        description: `${product.name} a été ajouté à vos favoris`,
      });
    }
  };

  const displayPrice = product.discounted_price || product.original_price;
  const hasDiscount = product.discounted_price && product.discounted_price < product.original_price;

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <div className="relative overflow-hidden">
          <div className="aspect-square bg-gray-100 dark:bg-gray-800">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400">Pas d'image</span>
              </div>
            )}
          </div>
          
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              -{Math.round(((product.original_price - product.discounted_price!) / product.original_price) * 100)}%
            </Badge>
          )}

          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 transition-colors ${
              isFavorite(product.id) 
                ? 'text-red-500 hover:text-red-600' 
                : 'text-gray-500 hover:text-red-500'
            }`}
            onClick={handleToggleFavorite}
          >
            <Heart className={`h-5 w-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">
                {displayPrice.toLocaleString()} FC
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  {product.original_price.toLocaleString()} FC
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                Stock faible
              </Badge>
            )}
          </div>

          <Button 
            className="w-full" 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
