
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Share2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppContact from '@/components/WhatsAppContact';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { mockProducts } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Product, ProductVariant } from '@/types';

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart } = useCart();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{[key: string]: string}>({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const favoriteStatus = product ? isFavorite(product.id) : false;
  
  // Similar products (from same category)
  const similarProducts = product 
    ? mockProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4)
    : [];
  
  // Format price to include thousands separator
  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  
  useEffect(() => {
    // In a real app, you would fetch the product from API
    const foundProduct = mockProducts.find(p => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Initialize selected variants with first option of each variant
      if (foundProduct.variants) {
        const initialVariants: {[key: string]: string} = {};
        foundProduct.variants.forEach(variant => {
          if (variant.options.length > 0) {
            initialVariants[variant.name] = variant.options[0];
          }
        });
        setSelectedVariants(initialVariants);
      }
    }
  }, [productId]);
  
  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="h-16 w-16 mx-auto mb-4 loading-pulse bg-gray-200 rounded-lg"></div>
            <h2 className="text-lg font-medium">Loading product...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedVariants);
  };
  
  const handleVariantChange = (variantName: string, value: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: value
    }));
  };
  
  const whatsappMessage = `Hello! I'm interested in ${product.name} priced at ${formatPrice(product.discountedPrice || product.originalPrice)} FC. ${
    Object.keys(selectedVariants).length > 0
      ? `Selected options: ${Object.entries(selectedVariants).map(([key, value]) => `${key}: ${value}`).join(', ')}. `
      : ''
  }Can you provide more information?`;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container py-6">
          {/* Breadcrumb */}
          <div className="text-sm breadcrumbs mb-4">
            <ul className="flex items-center space-x-2">
              <li><Link to="/" className="text-gray-500 hover:text-primary">Home</Link></li>
              <li className="text-gray-500">/</li>
              <li><Link to="/products" className="text-gray-500 hover:text-primary">Products</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-primary">{product.name}</li>
            </ul>
          </div>
          
          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-square">
                <img 
                  src={product.images[activeImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-contain"
                />
                {product.discount && product.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-secondary text-secondary-foreground px-2 py-1 text-xs font-semibold rounded-full">
                    -{product.discount}%
                  </div>
                )}
              </div>
              
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      className={cn(
                        "rounded-md overflow-hidden border-2 min-w-[60px] h-[60px]",
                        activeImageIndex === index ? "border-primary" : "border-transparent"
                      )}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} - view ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              
              {/* Price */}
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(product.discountedPrice || product.originalPrice)} FC
                </span>
                
                {product.discountedPrice && (
                  <span className="ml-2 text-gray-500 line-through">
                    {formatPrice(product.originalPrice)} FC
                  </span>
                )}
              </div>
              
              {/* Stock status */}
              <div>
                <span className={cn(
                  "inline-block px-2 py-1 text-xs font-medium rounded-full",
                  product.stock > 0 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                )}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </span>
              </div>
              
              {/* Description */}
              <p className="text-gray-600">{product.description}</p>
              
              {/* Variants */}
              {product.variants && product.variants.map((variant: ProductVariant) => (
                <div key={variant.id} className="space-y-2">
                  <h3 className="font-medium">{variant.name}:</h3>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map(option => (
                      <Button
                        key={option}
                        type="button"
                        variant={selectedVariants[variant.name] === option ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVariantChange(variant.name, option)}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Quantity */}
              <div className="space-y-2">
                <h3 className="font-medium">Quantity:</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.stock <= 0}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={product.stock <= 0 || quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                
                <WhatsAppContact 
                  phoneNumber="243123456789"
                  message={whatsappMessage}
                  variant="outline"
                  className="flex-1 bg-whatsapp text-white hover:bg-whatsapp-dark"
                >
                  Ask via WhatsApp
                </WhatsAppContact>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => favoriteStatus ? removeFromFavorites(product.id) : addToFavorites(product.id)}
                  className={cn(favoriteStatus ? "text-red-500" : "text-gray-500")}
                >
                  <Heart className={cn("h-5 w-5", favoriteStatus ? "fill-current" : "")} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    // Share functionality
                    if (navigator.share) {
                      navigator.share({
                        title: product.name,
                        text: product.description,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="pt-2">
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map(tag => (
                      <Link
                        key={tag}
                        to={`/products?tag=${tag}`}
                        className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full hover:bg-gray-200"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Additional Info Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="w-full border-b flex justify-start mb-6">
                <TabsTrigger value="description" className="pb-2">Description</TabsTrigger>
                <TabsTrigger value="specification" className="pb-2">Specification</TabsTrigger>
                <TabsTrigger value="shipping" className="pb-2">Shipping</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="text-gray-700">
                <p>{product.description}</p>
                <p className="mt-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. 
                  Duis vulputate commodo lectus, ac blandit elit tincidunt id.
                </p>
              </TabsContent>
              
              <TabsContent value="specification" className="text-gray-700">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Product Specifications</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-gray-600">Brand</span>
                          <span>BeShop</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Material</span>
                          <span>Premium Quality</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Warranty</span>
                          <span>1 Year</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">Dimensions</h3>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span className="text-gray-600">Weight</span>
                          <span>0.5 kg</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Height</span>
                          <span>10 cm</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">Width</span>
                          <span>15 cm</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="shipping" className="text-gray-700">
                <div className="space-y-4">
                  <p>
                    We offer fast and reliable shipping options throughout Congo. 
                    Shipping time depends on your location and typically takes 1-3 business days in major cities.
                  </p>
                  
                  <h3 className="font-medium">Shipping Rates:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Kinshasa: Free shipping on orders over 100,000 FC</li>
                    <li>Other major cities: 5,000 FC</li>
                    <li>Remote areas: 10,000 FC</li>
                  </ul>
                  
                  <p className="mt-4">
                    Contact our customer support via WhatsApp for more specific information about delivery to your area.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-semibold mb-6">Similar Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {similarProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
          
          {/* WhatsApp Contact Banner */}
          <div className="mt-16 bg-whatsapp/10 rounded-lg p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">Need help with this product?</h3>
                <p className="text-gray-600">Our team is ready to assist you with any questions.</p>
              </div>
              <WhatsAppContact
                phoneNumber="243123456789"
                message={`Hello! I have a question about ${product.name}.`}
                variant="default"
                className="bg-whatsapp hover:bg-whatsapp-dark"
              >
                Chat with Us on WhatsApp
              </WhatsAppContact>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetails;
