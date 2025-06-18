
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Star, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import ProductImageCarousel from '@/components/ProductImageCarousel';
import ProductAttributes from '@/components/ProductAttributes';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
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
    );
  }

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.discounted_price || product.original_price,
      image: product.images?.[0] || '',
      quantity,
      selectedColor,
      selectedSize
    };
    
    addToCart(cartItem);
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

  const price = product.discounted_price || product.original_price;
  const originalPrice = product.discounted_price ? product.original_price : null;
  const discount = product.discount || 0;

  return (
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
          >
            <ProductImageCarousel
              images={product.images || []}
              productName={product.name}
              onImageSelect={setSelectedImage}
            />
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
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleToggleFavorite}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
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
              colors={product.colors}
              sizes={product.sizes}
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

                <Button
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || inCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {inCart ? 'Déjà dans le panier' : 'Ajouter au panier'}
                </Button>
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
  );
};

export default ProductDetails;
