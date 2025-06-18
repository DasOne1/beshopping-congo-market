import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Star, Minus, Plus, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import ProductImageCarousel from '@/components/ProductImageCarousel';
import ProductAttributes from '@/components/ProductAttributes';
import WhatsAppContact from '@/components/WhatsAppContact';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { products, isLoading } = useProducts();
  const { addToCart, isInCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

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
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Lien copié",
        description: "Le lien du produit a été copié dans le presse-papiers.",
      });
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
          <div className="mb-6">
            <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux produits
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <ProductImageCarousel
                images={product.images || []}
                productName={product.name}
              />
              
              {/* Discount badge */}
              {discount > 0 && (
                <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">
                  -{discount}%
                </Badge>
              )}
              
              {/* Featured badge */}
              {product.featured && (
                <Badge className="absolute top-2 left-2 bg-yellow-500 text-white z-10">
                  Vedette
                </Badge>
              )}
              
              {/* Favorite and Share buttons */}
              <div className="absolute top-2 right-2 flex gap-2 z-10">
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
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Title and Brand */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
                </div>
                {product.brand && (
                  <p className="text-lg text-muted-foreground">{product.brand}</p>
                )}
              </div>

              {/* Rating and Reviews */}
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(24 avis)</span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-foreground">
                    {price.toLocaleString()} CDF
                  </span>
                  {originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      {originalPrice.toLocaleString()} CDF
                    </span>
                  )}
                  {discount > 0 && (
                    <Badge variant="destructive">-{discount}%</Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Attributes */}
              <ProductAttributes
                product={product}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onColorChange={setSelectedColor}
                onSizeChange={setSelectedSize}
              />

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm">
                  {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                </span>
              </div>

              {/* Quantity and Add to Cart */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Quantité:</span>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={quantity >= product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      onClick={handleAddToCart}
                      disabled={product.stock === 0 || inCart}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {inCart ? 'Déjà dans le panier' : 'Ajouter au panier'}
                    </Button>

                    <WhatsAppContact
                      phoneNumber="+243000000000"
                      message={`Bonjour, je souhaite commander le produit suivant:

Produit: ${product.name}
Prix: ${price.toLocaleString()} CDF
Quantité: ${quantity}
${selectedColor ? `Couleur: ${selectedColor}` : ''}
${selectedSize ? `Taille: ${selectedSize}` : ''}

Pouvez-vous me confirmer la disponibilité et les modalités de livraison ?`}
                      className="w-full"
                      size="default"
                    >
                      Commander via WhatsApp
                    </WhatsAppContact>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.material && (
                  <div>
                    <span className="font-medium">Matériau:</span>
                    <span className="ml-2 text-muted-foreground">{product.material}</span>
                  </div>
                )}
                {product.gender && (
                  <div>
                    <span className="font-medium">Genre:</span>
                    <span className="ml-2 text-muted-foreground">{product.gender}</span>
                  </div>
                )}
                {product.collection && (
                  <div>
                    <span className="font-medium">Collection:</span>
                    <span className="ml-2 text-muted-foreground">{product.collection}</span>
                  </div>
                )}
                {product.season && (
                  <div>
                    <span className="font-medium">Saison:</span>
                    <span className="ml-2 text-muted-foreground">{product.season}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
