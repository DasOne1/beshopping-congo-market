
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ShoppingCart, Plus, Minus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppContact from '@/components/WhatsAppContact';
import OrderForm from '@/components/OrderForm';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { products } = useProducts();
  
  // Get product details for all cart items
  const cartProducts = cart.map(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);
    return {
      ...cartItem,
      product
    };
  }).filter(item => item.product);
  
  // Calculate subtotal
  const subtotal = cartProducts.reduce((total, item) => {
    if (!item.product) return total;
    const price = item.product.discounted_price || item.product.original_price;
    return total + price * item.quantity;
  }, 0);
  
  // Format price to include thousands separator
  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <motion.h1 
          className="text-2xl md:text-3xl font-bold mb-6 flex items-center text-foreground"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ShoppingCart className="mr-2 h-6 w-6" />
          Votre Panier
        </motion.h1>
        
        {cart.length === 0 ? (
          <motion.div 
            className="text-center py-12 md:py-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2 text-foreground">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-6">
              Il semble que vous n'ayez pas encore ajouté de produits à votre panier.
            </p>
            <Button asChild>
              <Link to="/products">Commencer les achats</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <motion.div 
                className="bg-card rounded-lg shadow-sm border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="p-4 border-b border-border">
                  <h2 className="font-medium text-foreground">Articles du panier ({cart.length})</h2>
                </div>
                
                <div className="divide-y divide-border">
                  {cartProducts.map((item, index) => {
                    if (!item.product) return null;
                    const price = item.product.discounted_price || item.product.original_price;
                    const itemTotal = price * item.quantity;
                    
                    return (
                      <motion.div 
                        key={item.productId} 
                        className="p-4 flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex-shrink-0 w-20 h-20 bg-muted rounded-md overflow-hidden">
                          <Link to={`/product/${item.product.id}`}>
                            <img 
                              src={item.product.images[0] || '/placeholder.svg'} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                            />
                          </Link>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex flex-wrap justify-between mb-2">
                            <Link 
                              to={`/product/${item.product.id}`}
                              className="font-medium hover:text-primary transition-colors text-foreground"
                            >
                              {item.product.name}
                            </Link>
                            
                            <div className="font-medium text-primary">
                              {formatPrice(itemTotal)} FC
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-border rounded-md bg-background">
                              <button
                                className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="px-3 py-2 border-x border-border bg-muted/50 text-foreground min-w-[50px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                className="px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => updateQuantity(item.productId, Math.min(item.product.stock, item.quantity + 1))}
                                disabled={item.quantity >= item.product.stock}
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-red-500 hover:text-red-600 transition-colors p-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                
                <div className="p-4 border-t border-border flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={clearCart}
                  >
                    Vider le panier
                  </Button>
                  <Link to="/products">
                    <Button variant="ghost">
                      Continuer les achats
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
            
            {/* Order Form */}
            <div>
              <motion.div 
                className="sticky top-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <OrderForm 
                  cartProducts={cartProducts}
                  subtotal={subtotal}
                  formatPrice={formatPrice}
                />
                
                <div className="mt-4">
                  <WhatsAppContact
                    phoneNumber="243978100940"
                    message="Bonjour! J'ai besoin d'aide pour finaliser ma commande."
                    variant="outline"
                    className="w-full"
                  >
                    Besoin d'aide? Contactez-nous
                  </WhatsAppContact>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
