
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  original_price: number;
  discounted_price?: number;
  discount?: number;
  images: string[];
  stock: number;
  status?: string;
  tags?: string[];
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const isFavorite = favorites.some(fav => fav.id === product.id);
  const isOutOfStock = product.stock <= 0;
  const isInactive = product.status === 'inactive';
  const isUnavailable = isOutOfStock || isInactive;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite) {
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isUnavailable) {
      // Pour les articles indisponibles, rediriger vers la commande personnalisée
      toast({
        title: isInactive ? "Article inactif" : "Article en rupture de stock",
        description: isInactive 
          ? "Cet article n'est plus disponible, mais vous pouvez faire une commande personnalisée."
          : "Article en rupture de stock. Vous pouvez faire une commande personnalisée.",
        action: (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/custom-order'}
          >
            Commande personnalisée
          </Button>
        ),
      });
      return;
    }

    addToCart(product, 1);
    toast({
      title: "Ajouté au panier",
      description: `${product.name} a été ajouté à votre panier`,
    });
  };

  const currentPrice = product.discounted_price || product.original_price;

  return (
    <Card className={cn("group overflow-hidden hover:shadow-lg transition-all duration-300", className)}>
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden">
          {/* Image du produit */}
          <img
            src={product.images?.[0] || '/placeholder.svg'}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
              isUnavailable && "opacity-60"
            )}
            loading="lazy"
          />
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.featured && (
              <Badge className="bg-yellow-500 text-white">
                <Star className="h-3 w-3 mr-1" />
                Vedette
              </Badge>
            )}
            {product.discount && product.discount > 0 && (
              <Badge variant="destructive">
                -{product.discount}%
              </Badge>
            )}
            {isInactive && (
              <Badge variant="secondary" className="bg-gray-500 text-white">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Inactif
              </Badge>
            )}
            {isOutOfStock && !isInactive && (
              <Badge variant="destructive">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Rupture
              </Badge>
            )}
          </div>

          {/* Bouton favoris */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={handleToggleFavorite}
          >
            <Heart 
              className={cn(
                "h-4 w-4",
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
              )} 
            />
          </Button>
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-primary">
                {formatPrice(currentPrice)} FC
              </span>
              {product.discounted_price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.original_price)} FC
                </span>
              )}
            </div>
            
            {!isUnavailable && (
              <span className="text-xs text-green-600 font-medium">
                En stock: {product.stock}
              </span>
            )}
          </div>

          <Button 
            className={cn(
              "w-full",
              isUnavailable 
                ? "bg-orange-500 hover:bg-orange-600 text-white" 
                : "bg-primary hover:bg-primary/90"
            )}
            onClick={handleAddToCart}
            size="sm"
          >
            {isInactive ? (
              <>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Commande personnalisée
              </>
            ) : isOutOfStock ? (
              <>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Commande personnalisée
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Ajouter au panier
              </>
            )}
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
