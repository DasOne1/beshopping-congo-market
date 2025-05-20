
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppContact from '@/components/WhatsAppContact';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { mockProducts } from '@/data/mockData';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Create a lookup map of cart items by productId for easy access
  const cartItemsMap = cart.reduce((acc, item) => {
    acc[item.productId] = item;
    return acc;
  }, {} as Record<string, typeof cart[0]>);
  
  // Get product details for all cart items
  const cartProducts = mockProducts.filter(product => 
    cart.some(item => item.productId === product.id)
  );
  
  // Calculate subtotal
  const subtotal = cartProducts.reduce((total, product) => {
    const cartItem = cartItemsMap[product.id];
    const price = product.discountedPrice || product.originalPrice;
    return total + price * (cartItem?.quantity || 0);
  }, 0);
  
  // Format price to include thousands separator
  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  
  // Handle WhatsApp checkout
  const handleWhatsAppCheckout = () => {
    if (!whatsappNumber.trim()) {
      alert('Please enter your WhatsApp number');
      return;
    }
    
    setIsSubmitting(true);
    
    // Create order message
    let message = "Hello! I would like to place an order for the following items:\n\n";
    
    cartProducts.forEach(product => {
      const cartItem = cartItemsMap[product.id];
      const price = product.discountedPrice || product.originalPrice;
      
      message += `${product.name} x ${cartItem.quantity} = ${formatPrice(price * cartItem.quantity)} FC\n`;
      
      if (cartItem.selectedVariants) {
        const variants = Object.entries(cartItem.selectedVariants)
          .map(([key, value]) => `${key}: ${value}`)
          .join(', ');
        
        if (variants) {
          message += `Options: ${variants}\n`;
        }
      }
      
      message += '\n';
    });
    
    message += `\nTotal: ${formatPrice(subtotal)} FC\n\nPlease let me know how to proceed with the payment and delivery.`;
    
    // Format phone number
    const phone = whatsappNumber.replace(/\D/g, ''); // Remove non-digits
    
    // Open WhatsApp with the order message
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    
    // Reset state
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
            <ShoppingCart className="mr-2 h-6 w-6" />
            Your Shopping Cart
          </h1>
          
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Button asChild>
                <Link to="/products">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="p-4 border-b">
                    <h2 className="font-medium">Cart Items ({cart.length})</h2>
                  </div>
                  
                  <ul className="divide-y">
                    {cartProducts.map(product => {
                      const cartItem = cartItemsMap[product.id];
                      const price = product.discountedPrice || product.originalPrice;
                      const itemTotal = price * cartItem.quantity;
                      
                      return (
                        <li key={product.id} className="p-4 flex flex-col sm:flex-row">
                          <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden mr-4 mb-3 sm:mb-0">
                            <Link to={`/product/${product.id}`}>
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            </Link>
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex flex-wrap justify-between mb-2">
                              <Link 
                                to={`/product/${product.id}`}
                                className="font-medium hover:text-primary transition-colors"
                              >
                                {product.name}
                              </Link>
                              
                              <div className="font-medium text-primary">
                                {formatPrice(itemTotal)} FC
                              </div>
                            </div>
                            
                            {/* Show selected variants if any */}
                            {cartItem.selectedVariants && Object.keys(cartItem.selectedVariants).length > 0 && (
                              <div className="text-sm text-gray-500 mb-2">
                                {Object.entries(cartItem.selectedVariants).map(([key, value]) => (
                                  <span key={key} className="mr-3">{key}: {value}</span>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center border rounded-md">
                                <button
                                  className="px-3 py-1 text-gray-600 hover:text-gray-800"
                                  onClick={() => updateQuantity(product.id, Math.max(1, cartItem.quantity - 1))}
                                >
                                  -
                                </button>
                                <span className="px-3 py-1 border-x">{cartItem.quantity}</span>
                                <button
                                  className="px-3 py-1 text-gray-600 hover:text-gray-800"
                                  onClick={() => updateQuantity(product.id, Math.min(product.stock, cartItem.quantity + 1))}
                                  disabled={cartItem.quantity >= product.stock}
                                >
                                  +
                                </button>
                              </div>
                              
                              <button
                                onClick={() => removeFromCart(product.id)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  
                  <div className="p-4 border-t flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                    <Link to="/products">
                      <Button variant="ghost">
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-lg shadow-sm border sticky top-20">
                  <div className="p-4 border-b">
                    <h2 className="font-medium">Order Summary</h2>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatPrice(subtotal)} FC</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>{formatPrice(subtotal)} FC</span>
                    </div>
                    
                    <div className="pt-4">
                      <h3 className="font-medium mb-2">Checkout with WhatsApp</h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Enter your WhatsApp number to place your order via WhatsApp
                      </p>
                      
                      <div className="space-y-4">
                        <Input
                          type="tel"
                          placeholder="e.g., +243123456789"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                        />
                        
                        <Button
                          onClick={handleWhatsAppCheckout}
                          className="w-full bg-whatsapp hover:bg-whatsapp-dark"
                          disabled={isSubmitting}
                        >
                          <WhatsAppIcon className="mr-2 h-4 w-4" />
                          {isSubmitting ? 'Processing...' : 'Place Order via WhatsApp'}
                        </Button>
                        
                        <div className="text-center">
                          <span className="text-sm text-gray-500">or</span>
                        </div>
                        
                        <WhatsAppContact
                          phoneNumber="243123456789"
                          message="Hello! I need assistance with completing my order."
                          variant="outline"
                          className="w-full"
                        >
                          Request Assistance
                        </WhatsAppContact>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Small WhatsApp icon component for the checkout button
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.57-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default Cart;
