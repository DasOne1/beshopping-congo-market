import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ShoppingCart, Plus, Minus, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductImageCarousel from '@/components/ProductImageCarousel';
import ProductAttributes from '@/components/ProductAttributes';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProducts } from '@/hooks/useProducts';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useCachedCategories } from '@/hooks/useCachedCategories';
import { Product } from '@/types';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, isLoading } = useProducts();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { trackEvent } = useAnalytics();
  const { categories, getAllCategoryIds } = useCachedCategories();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = products.find(p => p.id === id);

  useEffect(() => {
    if (product) {
      trackEvent.mutate({
        event_type: 'view_product',
        product_id: product.id,
        session_id: sessionStorage.getItem('session_id') || 'anonymous'
      });
    }
  }, [product, trackEvent]);

  // Produits similaires avec gestion améliorée des sous-catégories
  const similarProducts = products.filter(p => {
    if (!p.is_visible || p.status !== 'active' || p.id === product?.id) {
      return false;
    }
    
    if (!product) return false;
    
    // Obtenir tous les IDs de catégories liées au produit actuel
    const productCategoryIds = [];
    if (product.category_id) {
      productCategoryIds.push(...getAllCategoryIds(product.category_id));
    }
    if (product.subcategory_id) {
      productCategoryIds.push(...getAllCategoryIds(product.subcategory_id));
    }
    
    // Vérifier si le produit similaire appartient aux mêmes catégories
    return productCategoryIds.some(catId => 
      p.category_id === catId || 
      p.subcategory_id === catId ||
      getAllCategoryIds(p.category_id || '').includes(catId) ||
      getAllCategoryIds(p.subcategory_id || '').includes(catId)
    );
  }).slice(0, 4);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      trackEvent.mutate({
        event_type: 'add_to_cart',
        product_id: product.id,
        session_id: sessionStorage.getItem('session_id') || 'anonymous'
      });
    }
  };

  const handleFavoriteToggle = () => {
    if (product) {
      if (isFavorite(product.id)) {
        removeFromFavorites(product.id);
      } else {
        addToFavorites(product);
      }
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
        console.log('Partage annulé');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < (product.stock || 0)) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6 pt-20 md:pt-24">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product || !product.is_visible || product.status !== 'active') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6 pt-20 md:pt-24">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
            <p className="text-muted-foreground mb-6">
              Le produit que vous recherchez n'existe pas ou n'est plus disponible.
            </p>
            <Button onClick={() => navigate('/products')}>
              Retour aux produits
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const category = categories.find(cat => cat.id === product.category_id);
  const discountPercentage = product.discount ? Math.round((product.discount / product.original_price) * 100) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pt-20 md:pt-24">
        {/* Navigation */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div className="space-y-4">
            <ProductImageCarousel 
              images={product.images || []} 
              productName={product.name}
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.featured && (
                <Badge variant="secondary" className="mb-2">
                  ⭐ Produit vedette
                </Badge>
              )}
              
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              
              {category && (
                <Badge variant="outline" className="mb-4">
                  {category.name}
                </Badge>
              )}

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {product.discounted_price ? (
                    <>
                      <span className="text-3xl font-bold text-primary">
                        {product.discounted_price.toLocaleString()} FC
                      </span>
                      <span className="text-lg text-muted-foreground line-through">
                        {product.original_price.toLocaleString()} FC
                      </span>
                      {discountPercentage && (
                        <Badge variant="destructive">
                          -{discountPercentage}%
                        </Badge>
                      )}
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-primary">
                      {product.original_price.toLocaleString()} FC
                    </span>
                  )}
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Attributes */}
            <ProductAttributes product={product} />

            <Separator />

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                (product.stock || 0) > 0 ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className={`font-medium ${
                (product.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {(product.stock || 0) > 0 ? `En stock (${product.stock})` : 'Rupture de stock'}
              </span>
            </div>

            {/* Quantity and Actions */}
            {(product.stock || 0) > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-medium">Quantité:</label>
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="px-3"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={increaseQuantity}
                      disabled={quantity >= (product.stock || 0)}
                      className="px-3"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center gap-2"
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Ajouter au panier
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleFavoriteToggle}
                    className={`p-3 ${isFavorite(product.id) ? 'text-red-500 border-red-200' : ''}`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShare}
                    className="p-3"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Truck className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Livraison</p>
                  <p className="text-xs text-muted-foreground">Disponible</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Shield className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Garantie</p>
                  <p className="text-xs text-muted-foreground">Qualité assurée</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Star className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Support</p>
                  <p className="text-xs text-muted-foreground">24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map(product => (
                <ProductCard key={product.id} product={product} viewMode="grid" />
              ))}
            </div>
          </section>
        )}
      </main>
      
      <div className="pb-16 md:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetails;
