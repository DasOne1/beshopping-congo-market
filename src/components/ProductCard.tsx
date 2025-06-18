import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Package, Palette, Ruler, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { toast } from '@/components/ui/use-toast';
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

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const shareUrl = `${window.location.origin}/product/${product.id}`;
    const shareText = `Découvrez ${product.name} sur BeShopping - ${product.discounted_price || product.original_price} CDF`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Erreur lors du partage:', error);
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API de partage
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
          toast({
            title: "Lien copié",
            description: "Le lien du produit a été copié dans le presse-papiers.",
          });
        } catch (error) {
          console.error('Erreur lors de la copie:', error);
          // Si la copie échoue, essayer d'exporter l'image
          exportProductImage();
        }
      } else {
        // Si clipboard n'est pas disponible, exporter l'image
        exportProductImage();
      }
    }
  };

  const exportProductImage = () => {
    try {
      const shareUrl = `${window.location.origin}/product/${product.id}`;
      
      // Créer un canvas pour combiner l'image et les informations
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        toast({
          title: "Erreur",
          description: "Impossible d'exporter l'image.",
          variant: "destructive",
        });
        return;
      }

      // Dimensions du canvas
      canvas.width = 400;
      canvas.height = 500;

      // Fond blanc
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Charger l'image du produit
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Dessiner l'image (redimensionnée)
        const imgWidth = 300;
        const imgHeight = 300;
        const imgX = (canvas.width - imgWidth) / 2;
        const imgY = 20;
        
        ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);

        // Ajouter les informations du produit
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        
        // Nom du produit
        const productName = product.name.length > 30 ? product.name.substring(0, 30) + '...' : product.name;
        ctx.fillText(productName, canvas.width / 2, imgY + imgHeight + 30);

        // Prix
        ctx.font = 'bold 20px Arial';
        const price = product.discounted_price || product.original_price;
        ctx.fillText(`${price.toLocaleString()} CDF`, canvas.width / 2, imgY + imgHeight + 55);

        // Lien du site
        ctx.font = '12px Arial';
        ctx.fillStyle = '#666666';
        ctx.fillText('Découvrez sur BeShopping', canvas.width / 2, imgY + imgHeight + 80);
        ctx.fillText(shareUrl, canvas.width / 2, imgY + imgHeight + 100);

        // Partager l'image
        canvas.toBlob((blob) => {
          if (blob) {
            shareImage(blob);
          }
        }, 'image/png');
      };

      img.onerror = () => {
        // Si l'image ne peut pas être chargée, créer une image avec juste le texte
        ctx.fillStyle = '#f3f4f6';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('BeShopping', canvas.width / 2, 100);
        
        ctx.font = '16px Arial';
        const productName = product.name.length > 40 ? product.name.substring(0, 40) + '...' : product.name;
        ctx.fillText(productName, canvas.width / 2, 150);
        
        ctx.font = 'bold 18px Arial';
        const price = product.discounted_price || product.original_price;
        ctx.fillText(`${price.toLocaleString()} CDF`, canvas.width / 2, 200);
        
        ctx.font = '12px Arial';
        ctx.fillStyle = '#666666';
        ctx.fillText(shareUrl, canvas.width / 2, 250);

        canvas.toBlob((blob) => {
          if (blob) {
            shareImage(blob);
          }
        }, 'image/png');
      };

      // Utiliser la première image du produit ou une image par défaut
      const imageUrl = product.images && product.images.length > 0 
        ? product.images[0] 
        : '/placeholder.svg';
      
      img.src = imageUrl;
      
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter l'image du produit.",
        variant: "destructive",
      });
    }
  };

  const shareImage = async (blob: Blob) => {
    try {
      const shareUrl = `${window.location.origin}/product/${product.id}`;
      const shareText = `Découvrez ${product.name} sur BeShopping - ${product.discounted_price || product.original_price} CDF`;
      
      // Essayer d'abord le partage simple (plus compatible)
      if (navigator.share) {
        try {
          await navigator.share({
            title: product.name,
            text: shareText,
            url: shareUrl
          });
          toast({
            title: "Produit partagé",
            description: "Le produit a été partagé avec succès.",
          });
          return;
        } catch (shareError) {
          console.log('Partage simple échoué, essai avec image...');
        }
      }

      // Si le partage simple échoue, essayer avec l'image
      if (navigator.share && navigator.canShare) {
        try {
          const file = new File([blob], `${product.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_beshopping.png`, { 
            type: 'image/png' 
          });
          
          const shareData = {
            title: product.name,
            text: shareText,
            url: shareUrl,
            files: [file]
          };

          if (navigator.canShare(shareData)) {
            await navigator.share(shareData);
            toast({
              title: "Image partagée",
              description: "L'image du produit a été partagée avec succès.",
            });
            return;
          }
        } catch (fileShareError) {
          console.log('Partage avec fichiers échoué...');
        }
      }

      // Fallback: copier le lien dans le presse-papiers
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        toast({
          title: "Lien copié",
          description: "Le lien du produit a été copié dans le presse-papiers.",
        });
      } else {
        // Dernier recours: télécharger l'image
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${product.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_beshopping.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        toast({
          title: "Image téléchargée",
          description: "L'image a été téléchargée car le partage n'est pas disponible.",
        });
      }
      
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      toast({
        title: "Erreur",
        description: "Impossible de partager l'image.",
        variant: "destructive",
      });
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Si on clique sur un bouton, ne pas déclencher le partage
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a')) {
      return;
    }
    
    // Sinon, partager le produit
    handleShare(e);
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
      <Card 
        className={`group relative overflow-hidden border border-border/40 hover:border-border/80 hover:shadow-lg transition-all duration-300 bg-card cursor-pointer ${isOutOfStock ? 'opacity-75' : ''}`}
        onClick={handleCardClick}
      >
        <div className="relative">
          <Link to={`/product/${product.id}`} onClick={(e) => e.stopPropagation()}>
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
            <Badge className="absolute top-2 right-16 bg-yellow-500 text-white z-10">
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
          
          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex gap-1 z-10">
            {/* Share button */}
            <Button
              variant="ghost"
              size="icon"
              className="bg-background/80 hover:bg-background h-8 w-8"
              onClick={handleShare}
            >
              <Share2 className="h-3 w-3" />
            </Button>
            
            {/* Favorite button */}
            <Button
              variant="ghost"
              size="icon"
              className="bg-background/80 hover:bg-background h-8 w-8"
              onClick={handleToggleFavorite}
            >
              <Heart 
                className={`h-3 w-3 ${isFavorite(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
              />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-3">
          <Link to={`/product/${product.id}`} onClick={(e) => e.stopPropagation()}>
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
