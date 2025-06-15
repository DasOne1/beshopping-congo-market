
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, ShoppingCart, Star, Truck, Shield, RotateCcw, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductImageCarousel from '@/components/ProductImageCarousel';
import ProductAttributes from '@/components/ProductAttributes';
import WhatsAppContact from '@/components/WhatsAppContact';
import { MobileNavBar } from '@/components/MobileNavBar';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { toast } from '@/components/ui/use-toast';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, isLoading } = useProducts();
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { trackEvent } = useAnalytics();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  const product = products?.find(p => p.id === id);
  const isFavorite = favorites.some(fav => fav.id === product?.id);

  useEffect(() => {
    if (product) {
      // Track product view
      trackEvent.mutate({
        event_type: 'view_product',
        product_id: product.id,
        session_id: sessionStorage.getItem('session_id') || 'anonymous',
        metadata: {
          product_name: product.name,
          category: product.category_id,
          price: product.discounted_price || product.original_price
        }
      });

      // Set default selections
      if (product.colors && product.colors.length > 0 && !selectedColor) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0 && !selectedSize) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product, trackEvent, selectedColor, selectedSize]);

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      ...product,
      quantity,
      selectedColor: selectedColor || undefined,
      selectedSize: selectedSize || undefined,
    };

    addToCart(cartItem);
    
    // Track add to cart event
    trackEvent.mutate({
      event_type: 'add_to_cart',
      product_id: product.id,
      session_id: sessionStorage.getItem('session_id') || 'anonymous',
      metadata: {
        product_name: product.name,
        quantity,
        selectedColor,
        selectedSize,
        price: product.discounted_price || product.original_price
      }
    });

    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} a été ajouté à votre panier`,
    });
  };

  const handleToggleFavorite = () => {
    if (!product) return;

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

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Lien copié",
          description: "Le lien du produit a été copié dans le presse-papiers",
        });
      }
    } else if (product) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "Le lien du produit a été copié dans le presse-papiers",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 pb-20 md:pb-8">
          <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <MobileNavBar />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 pb-20 md:pb-8">
          <div className="container mx-auto px-4 py-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
            <p className="text-muted-foreground mb-8">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
            <Button onClick={() => navigate('/products')}>
              Retour aux produits
            </Button>
          </div>
        </div>
        <Footer />
        <MobileNavBar />
      </div>
    );
  }

  const finalPrice = product.discounted_price || product.original_price;
  const discount = product.discount || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-4 md:py-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 p-0 h-auto"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </motion.div>

          {/* Product Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ProductImageCarousel 
                images={product.images || []} 
                productName={product.name}
              />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleToggleFavorite}
                      className={isFavorite ? "text-red-500" : ""}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleShare}>
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Brand and SKU */}
                <div className="flex items-center gap-4 mb-4">
                  {product.brand && (
                    <Badge variant="outline">
                      {product.brand}
                    </Badge>
                  )}
                  {product.sku && (
                    <span className="text-sm text-muted-foreground">
                      SKU: {product.sku}
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {finalPrice.toLocaleString()} CDF
                  </span>
                  {discount > 0 && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        {product.original_price.toLocaleString()} CDF
                      </span>
                      <Badge variant="destructive">
                        -{discount}%
                      </Badge>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mb-4">
                  {product.stock > 0 ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      En stock ({product.stock} disponibles)
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      Rupture de stock
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              <Separator />

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Couleur</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedColor(color)}
                        className="capitalize"
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Taille</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                        className="uppercase"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Quantité</h3>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 border rounded text-center min-w-[60px]">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Ajouter au panier
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
                <div className="flex items-center gap-3 text-sm">
                  <Truck className="h-5 w-5 text-primary" />
                  <span>Livraison rapide</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <span>Retour gratuit</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Product Attributes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <ProductAttributes product={product} />
          </motion.div>
        </div>
      </main>

      <Footer />
      <MobileNavBar />
      <WhatsAppContact 
        phoneNumber="+243 978 100 940" 
        message={`Bonjour, je suis intéressé par le produit: ${product.name}`}
      />
    </div>
  );
};

export default ProductDetails;
