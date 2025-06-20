
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Star, Minus, Plus, Share2, Package, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import ProductImageCarousel from '@/components/ProductImageCarousel';
import ProductAttributes from '@/components/ProductAttributes';
import CustomerInfoModal from '@/components/CustomerInfoModal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { products, isLoading } = useProducts();
  const { addToCart, isInCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { generateProductOrderMessage } = useWhatsApp();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const product = products?.find(p => p.id === id);
  const isFavorite = favorites.some(fav => fav === id);
  const inCart = isInCart(id || '');

  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Produit non trouvé</h1>
            <Link to="/products">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux produits
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id);
    toast({
      title: "Produit ajouté au panier",
      description: `${product.name} a été ajouté à votre panier.`,
    });
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(product.id);
      toast({
        title: "Retiré des favoris",
        description: `${product.name} a été retiré de vos favoris.`,
      });
    } else {
      addToFavorites(product.id);
      toast({
        title: "Ajouté aux favoris",
        description: `${product.name} a été ajouté à vos favoris.`,
      });
    }
  };

  const handleWhatsAppOrder = (customerInfo: any) => {
    const message = generateProductOrderMessage(
      product.name, 
      product.discounted_price || product.original_price, 
      quantity, 
      selectedColor, 
      selectedSize
    );
    
    // Ouvrir WhatsApp avec le message
    const phoneNumber = "+243970284639";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    setShowCustomerModal(false);
    
    toast({
      title: "Redirection vers WhatsApp",
      description: "Vous allez être redirigé vers WhatsApp pour finaliser votre commande.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Découvrez ${product.name} sur BeShopping`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Erreur lors du partage:', error);
      }
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API de partage
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast({
            title: "Lien copié",
            description: "Le lien du produit a été copié dans le presse-papiers.",
          });
        } catch (error) {
          console.error('Erreur lors de la copie:', error);
          toast({
            title: "Erreur",
            description: "Impossible de copier le lien.",
            variant: "destructive",
          });
        }
      } else {
        // Fallback pour les navigateurs très anciens
        toast({
          title: "Partage non disponible",
          description: "Votre navigateur ne supporte pas le partage automatique.",
          variant: "destructive",
        });
      }
    }
  };

  const price = product.discounted_price || product.original_price;
  const originalPrice = product.discounted_price ? product.original_price : null;
  const discount = product.discount || 0;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux produits
            </Link>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Images Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="xl:col-span-1"
            >
              <div className="relative">
                <ProductImageCarousel
                  images={product.images || []}
                  productName={product.name}
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                  {discount > 0 && (
                    <Badge className="bg-red-500 text-white">
                      -{discount}%
                    </Badge>
                  )}
                  {product.featured && (
                    <Badge className="bg-yellow-500 text-white">
                      Vedette
                    </Badge>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="absolute top-3 right-3 flex gap-2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 hover:bg-background"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background/80 hover:bg-background"
                    onClick={handleToggleFavorite}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Product Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="xl:col-span-2"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Product Details */}
                <div className="space-y-4">
                  {/* Header Info */}
                  <div className="space-y-3">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground mb-1">{product.name}</h1>
                      {product.brand && (
                        <p className="text-muted-foreground">Marque: {product.brand}</p>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">(24 avis)</span>
                    </div>

                    {/* Price */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-bold text-foreground">
                          {price.toLocaleString()} CDF
                        </span>
                        {originalPrice && (
                          <span className="text-lg text-muted-foreground line-through">
                            {originalPrice.toLocaleString()} CDF
                          </span>
                        )}
                      </div>
                      {discount > 0 && (
                        <Badge variant="destructive">Économisez {discount}%</Badge>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm">
                        {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Product Attributes */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold">Caractéristiques</h3>
                    <ProductAttributes
                      product={product}
                      selectedColor={selectedColor}
                      selectedSize={selectedSize}
                      onColorChange={setSelectedColor}
                      onSizeChange={setSelectedSize}
                    />
                  </div>

                  {/* Additional Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {product.material && (
                      <div>
                        <span className="font-medium text-muted-foreground">Matériau:</span>
                        <p>{product.material}</p>
                      </div>
                    )}
                    {product.gender && (
                      <div>
                        <span className="font-medium text-muted-foreground">Genre:</span>
                        <p>{product.gender}</p>
                      </div>
                    )}
                    {product.collection && (
                      <div>
                        <span className="font-medium text-muted-foreground">Collection:</span>
                        <p>{product.collection}</p>
                      </div>
                    )}
                    {product.season && (
                      <div>
                        <span className="font-medium text-muted-foreground">Saison:</span>
                        <p>{product.season}</p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {product.description && (
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Description</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
                    </div>
                  )}
                </div>

                {/* Right Column - Purchase & Services */}
                <div className="space-y-4">
                  {/* Purchase Card */}
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Quantité:</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                            className="h-8 w-8"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setQuantity(quantity + 1)}
                            disabled={quantity >= product.stock}
                            className="h-8 w-8"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button
                          className="w-full h-10"
                          onClick={handleAddToCart}
                          disabled={product.stock === 0 || inCart}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {inCart ? 'Déjà dans le panier' : 'Ajouter au panier'}
                        </Button>

                        <Button
                          onClick={() => setShowCustomerModal(true)}
                          className="w-full h-10 bg-green-600 hover:bg-green-700"
                          size="default"
                        >
                          Commander via WhatsApp
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Service Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                      <Package className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium text-xs">Livraison gratuite</p>
                        <p className="text-xs text-muted-foreground">Commande sup 50,000 CDF</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                      <Shield className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium text-xs">Garantie</p>
                        <p className="text-xs text-muted-foreground">30 jours retour</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
                      <Clock className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium text-xs">Livraison rapide</p>
                        <p className="text-xs text-muted-foreground">2-3 jours ouvrables</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="pb-16 md:pb-0">
        <Footer />
      </div>

      <CustomerInfoModal
        open={showCustomerModal}
        onOpenChange={setShowCustomerModal}
        onSubmit={handleWhatsAppOrder}
        title="Commander via WhatsApp"
        description="Remplissez vos informations pour commander ce produit via WhatsApp"
      />
    </>
  );
};

export default ProductDetails;
