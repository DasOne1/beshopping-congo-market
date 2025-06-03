/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Minus, Plus, Share2, ArrowLeft, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductImageCarousel from '@/components/ProductImageCarousel';
import WhatsAppContact from '@/components/WhatsAppContact';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';
import { toast } from '@/hooks/use-toast';
import OrderConfirmationDialog from '@/components/OrderConfirmationDialog';

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { products, isLoading } = useProducts();
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { trackEvent } = useAnalytics();
  const { currentCustomer, isAuthenticated } = useCustomerAuth();
  
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
  console.log('ProductDetails - productId:', productId);
  console.log('ProductDetails - products:', products);
  
  const product = products?.find(p => p.id === productId);
  console.log('ProductDetails - found product:', product);
  
  const relatedProducts = products?.filter(p => 
    p.category_id === product?.category_id && 
    p.id !== productId && 
    p.status === 'active'
  ).slice(0, 4) || [];

  useEffect(() => {
    if (product) {
      trackEvent.mutate({
        event_type: 'view_product',
        product_id: product.id,
        session_id: sessionStorage.getItem('session_id') || 'anonymous',
        metadata: { product_name: product.name, price: product.discounted_price || product.original_price }
      });
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 w-32 rounded mb-4"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-200 aspect-square rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 rounded"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                <div className="bg-gray-200 h-6 rounded w-1/3"></div>
                <div className="bg-gray-200 h-24 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    console.log('ProductDetails - product not found, redirecting to products');
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Chargement du produit...</h2>
            <p className="text-muted-foreground mb-6">
              Veuillez patienter pendant que nous chargeons les détails du produit.
            </p>
            <Button onClick={() => navigate('/products')}>
              Retour aux produits
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentPrice = product.discounted_price || product.original_price;
  const isFav = favorites.includes(product.id);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    trackEvent.mutate({
      event_type: 'add_to_cart',
      product_id: product.id,
      session_id: sessionStorage.getItem('session_id') || 'anonymous',
      metadata: { quantity, product_name: product.name, price: currentPrice }
    });
    toast({
      title: "Produit ajouté au panier",
      description: `${quantity} × ${product.name} ajouté au panier`,
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Découvrez ${product.name} sur BeShopping Congo`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "Le lien du produit a été copié dans le presse-papiers",
      });
    }
  };

  const getWhatsAppMessage = () => {
    const customerInfo = isAuthenticated && currentCustomer
      ? `\n\nInformations client:\nNom: ${currentCustomer.name}\nTéléphone: ${currentCustomer.phone}${currentCustomer.email ? `\nEmail: ${currentCustomer.email}` : ''}${currentCustomer.address ? `\nAdresse: ${typeof currentCustomer.address === 'string' ? currentCustomer.address : currentCustomer.address?.address}` : ''}`
      : '\n\nClient: Anonyme';

    return `Bonjour! Je suis intéressé par ${product.name} au prix de ${formatPrice(currentPrice)} FC.${customerInfo}\n\nPouvez-vous me donner plus d'informations?`;
  };

  const handleWhatsAppClick = () => {
    if (!isAuthenticated) {
      navigate('/customer-auth', { state: { from: `/product/${productId}` } });
      return;
    }

    const message = getWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/243978100940?text=${encodedMessage}`;
    
    // Ouvrir WhatsApp immédiatement
    window.open(url, '_blank');
    
    // Afficher la confirmation après avoir ouvert WhatsApp
    setOrderDetails({
      customerName: currentCustomer?.name || 'Anonyme',
      customerPhone: currentCustomer?.phone || 'Non spécifié',
      customerAddress: typeof currentCustomer?.address === 'string' 
        ? currentCustomer.address 
        : currentCustomer?.address?.address || 'Non spécifiée',
      orderType: 'whatsapp'
    });
    
    setShowConfirmation(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-6"
        >
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </motion.div>

        {/* Product Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Images avec carrousel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <ProductImageCarousel
                images={product.images || []}
                productName={product.name}
              />
              {product.discount && product.discount > 0 && (
                <Badge className="absolute top-4 left-4 z-10">
                  -{product.discount}%
                </Badge>
              )}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => isFav ? removeFromFavorites(product.id) : addToFavorites(product.id)}
                  className="bg-white/80 backdrop-blur-sm"
                >
                  <Heart className={`h-4 w-4 ${isFav ? 'fill-current text-red-500' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="bg-white/80 backdrop-blur-sm"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">(4.8)</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-muted-foreground">
                  {product.popular && product.popular > 0 ? `${product.popular} vendus` : 'Nouveau'}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(currentPrice)} FC
              </span>
              {product.discounted_price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.original_price)} FC
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock && product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={product.stock && product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock && product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            {product.stock && product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantité:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                    disabled={quantity >= (product.stock || 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock <= 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Ajouter au panier
              </Button>

              <WhatsAppContact
                phoneNumber="243978100940"
                message={getWhatsAppMessage()}
                size="lg"
                className="bg-whatsapp hover:bg-whatsapp-dark text-white border-whatsapp"
                onCustomClick={handleWhatsAppClick}
              >
                WhatsApp
              </WhatsAppContact>
            </div>

            {/* Order Confirmation Dialog */}
            <OrderConfirmationDialog
              isOpen={showConfirmation}
              onClose={() => setShowConfirmation(false)}
              orderDetails={orderDetails}
            />

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-5 w-5 text-primary" />
                <span>Livraison rapide</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-5 w-5 text-primary" />
                <span>Garantie qualité</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span>Retour 7 jours</span>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-8">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <ProductCard product={relatedProduct} />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
      <div className="pb-16 md:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetails;
