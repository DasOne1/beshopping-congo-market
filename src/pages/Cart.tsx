
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ShoppingCart, Plus, Minus } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppContact from '@/components/WhatsAppContact';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { products } = useProducts();
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
  
  // Handle WhatsApp checkout
  const handleWhatsAppCheckout = () => {
    if (!whatsappNumber.trim()) {
      alert('Veuillez entrer votre numéro WhatsApp');
      return;
    }
    
    setIsSubmitting(true);
    
    // Create order message
    let message = "Bonjour! Je voudrais passer commande pour les articles suivants:\n\n";
    
    cartProducts.forEach(item => {
      if (!item.product) return;
      const price = item.product.discounted_price || item.product.original_price;
      
      message += `${item.product.name} x ${item.quantity} = ${formatPrice(price * item.quantity)} FC\n\n`;
    });
    
    message += `\nTotal: ${formatPrice(subtotal)} FC\n\nMerci de me faire savoir comment procéder au paiement et à la livraison.`;
    
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
            
            {/* Order Summary */}
            <div>
              <motion.div 
                className="bg-card rounded-lg shadow-sm border border-border sticky top-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="p-4 border-b border-border">
                  <h2 className="font-medium text-foreground">Résumé de la commande</h2>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="flex justify-between text-foreground">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span>{formatPrice(subtotal)} FC</span>
                  </div>
                  
                  <div className="flex justify-between text-foreground">
                    <span className="text-muted-foreground">Livraison</span>
                    <span>Calculé à la commande</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium text-lg text-foreground">
                    <span>Total</span>
                    <span>{formatPrice(subtotal)} FC</span>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-medium mb-2 text-foreground">Commander via WhatsApp</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Entrez votre numéro WhatsApp pour passer votre commande
                    </p>
                    
                    <div className="space-y-3">
                      <Input
                        type="tel"
                        placeholder="ex: +243123456789"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        className="bg-background border-border"
                      />
                      
                      <Button
                        onClick={handleWhatsAppCheckout}
                        className="w-full bg-[#25D366] hover:bg-[#075E54] text-white"
                        disabled={isSubmitting}
                      >
                        <WhatsAppIcon className="mr-2 h-4 w-4" />
                        {isSubmitting ? 'Traitement...' : 'Commander via WhatsApp'}
                      </Button>
                      
                      <div className="text-center">
                        <span className="text-sm text-muted-foreground">ou</span>
                      </div>
                      
                      <WhatsAppContact
                        phoneNumber="243123456789"
                        message="Bonjour! J'ai besoin d'aide pour finaliser ma commande."
                        variant="outline"
                        className="w-full"
                      >
                        Demander de l'aide
                      </WhatsAppContact>
                    </div>
                  </div>
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
