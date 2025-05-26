
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("overflow-hidden transition-all hover:shadow-lg border-0", className)}>
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
          <div className="relative aspect-square overflow-hidden">
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <button 
              onClick={(e) => {
                e.preventDefault();
                favoriteStatus ? removeFromFavorites(product.id) : addToFavorites(product.id);
              }}
              className={cn(
                "absolute top-2 right-2 p-1.5 rounded-full transition-colors",
                favoriteStatus ? "bg-red-50 text-red-500" : "bg-white/80 text-gray-400"
              )}
            >
              <Heart className={cn("h-4 w-4", favoriteStatus ? "fill-current" : "")} />
            </button>
          </div>
        </Link>
        
        <CardContent className="p-3">
          <div className="mb-2">
            <Link to={`/product/${product.id}`}>
              <h3 className="font-medium text-sm leading-tight line-clamp-2 hover:text-primary transition-colors h-10">
                {product.name}
              </h3>
            </Link>
          </div>
          
          <div className="flex items-baseline mb-2">
            <span className="font-semibold text-primary">
              {formatPrice(productPrice)} FC
            </span>
            
            {product.discountedPrice && (
              <span className="ml-2 text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)} FC
              </span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-1.5 mt-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 min-w-0 h-8 text-xs"
              disabled={product.stock <= 0}
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product.id, 1);
              }}
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1" />
              <span>Add</span>
            </Button>
            
            <WhatsAppContact 
              phoneNumber="243978100940"
              message={whatsappMessage}
              variant="default"
              size="sm"
              className="flex-1 min-w-0 h-8 text-xs bg-whatsapp hover:bg-whatsapp-dark"
            >
              Ask
            </WhatsAppContact>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
