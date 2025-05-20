
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import WhatsAppContact from './WhatsAppContact';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  const favoriteStatus = isFavorite(product.id);
  const productPrice = product.discountedPrice || product.originalPrice;
  const whatsappMessage = `Hello! I'm interested in ${product.name} priced at ${formatPrice(productPrice)} FC. Can you provide more information?`;
  
  // Format price to include thousands separator
  function formatPrice(price: number): string {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  return (
    <Card className={cn("overflow-hidden transition-shadow hover:shadow-md", className)}>
      <Link to={`/product/${product.id}`} className="block relative">
        {product.discount && product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-secondary text-secondary-foreground px-2 py-1 text-xs font-semibold rounded-full">
            -{product.discount}%
          </div>
        )}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="h-48 w-full object-cover"
        />
      </Link>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>
        
        <div className="flex items-baseline mb-3">
          <span className="font-semibold text-primary">
            {formatPrice(productPrice)} FC
          </span>
          
          {product.discountedPrice && (
            <span className="ml-2 text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)} FC
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1 min-w-0"
            disabled={product.stock <= 0}
            onClick={() => addToCart(product.id)}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            <span>Add</span>
          </Button>
          
          <WhatsAppContact 
            phoneNumber="243123456789"
            message={whatsappMessage}
            variant="default"
            size="sm"
            className="flex-1 min-w-0 bg-whatsapp hover:bg-whatsapp-dark"
          >
            Ask
          </WhatsAppContact>
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => favoriteStatus ? removeFromFavorites(product.id) : addToFavorites(product.id)}
            className={cn(favoriteStatus ? "text-red-500" : "text-gray-500")}
          >
            <Heart className={cn("h-4 w-4", favoriteStatus ? "fill-current" : "")} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
