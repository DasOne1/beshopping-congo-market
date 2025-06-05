
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';
import WhatsAppContact from '@/components/WhatsAppContact';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { products } = useProducts();

  // Get cart products with details
  const cartProducts = cart.map(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);
    return {
      ...cartItem,
      product
    };
  }).filter(item => item.product);

  const totalPrice = getTotalPrice(products);

  // Generate WhatsApp message
  const generateWhatsAppMessage = (cartProducts: any[], totalPrice: number): string => {
    let message = `🛒 *Nouvelle Commande - BeShopping Congo*\n\n`;
    message += `🛍️ *Produits commandés:*\n`;
    
    cartProducts.forEach((item, index) => {
      const product = item.product;
      const price = product.discounted_price || product.original_price;
      const total = price * item.quantity;
      message += `${index + 1}. ${product.name}\n`;
      message += `   • Quantité: ${item.quantity}\n`;
      message += `   • Prix unitaire: ${price.toLocaleString()} CDF\n`;
      message += `   • Total: ${total.toLocaleString()} CDF\n\n`;
    });
    
    message += `💰 *Total général: ${totalPrice.toLocaleString()} CDF*\n\n`;
    message += `📅 *Date: ${new Date().toLocaleDateString('fr-FR')}*`;
    
    return message;
  };

  const whatsappMessage = generateWhatsAppMessage(cartProducts, totalPrice);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-20 md:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <ShoppingCart className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Votre panier est vide</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Découvrez nos produits et ajoutez-les à votre panier pour commencer vos achats.
            </p>
            <Button asChild size="lg">
              <Link to="/products">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Continuer mes achats
              </Link>
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-20 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <ShoppingCart className="mr-2 h-6 w-6" />
              Mon Panier ({cart.length})
            </h1>
            <Button variant="outline" onClick={clearCart}>
              <Trash2 className="mr-2 h-4 w-4" />
              Vider le panier
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Articles du panier */}
            <div className="lg:col-span-2 space-y-4">
              {cartProducts.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Image du produit */}
                        <div className="w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
                          {item.product?.images && item.product.images.length > 0 ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              Pas d'image
                            </div>
                          )}
                        </div>

                        {/* Détails du produit */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{item.product?.name}</h3>
                          
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              {/* Prix */}
                              <div className="flex items-center gap-2">
                                {item.product?.discounted_price ? (
                                  <>
                                    <span className="text-lg font-bold text-green-600">
                                      {item.product.discounted_price.toLocaleString()} CDF
                                    </span>
                                    <span className="text-sm text-muted-foreground line-through">
                                      {item.product.original_price.toLocaleString()} CDF
                                    </span>
                                    <Badge variant="destructive" className="text-xs">
                                      -{item.product.discount}%
                                    </Badge>
                                  </>
                                ) : (
                                  <span className="text-lg font-bold">
                                    {item.product?.original_price.toLocaleString()} CDF
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Contrôles de quantité */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="px-4 py-2 min-w-[50px] text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFromCart(item.productId)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Sous-total */}
                          <div className="mt-4 text-right">
                            <span className="text-sm text-muted-foreground">Sous-total: </span>
                            <span className="font-bold">
                              {((item.product?.discounted_price || item.product?.original_price || 0) * item.quantity).toLocaleString()} CDF
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Résumé de la commande */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Résumé de la commande</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {cartProducts.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span>{item.product?.name} x{item.quantity}</span>
                        <span>
                          {((item.product?.discounted_price || item.product?.original_price || 0) * item.quantity).toLocaleString()} CDF
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span>{totalPrice.toLocaleString()} CDF</span>
                  </div>

                  <div className="space-y-2">
                    <Button asChild className="w-full" size="lg">
                      <Link to="/checkout">
                        Finaliser la commande
                      </Link>
                    </Button>
                    
                    <WhatsAppContact
                      phoneNumber="243970284772"
                      message={whatsappMessage}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Commander via WhatsApp
                    </WhatsAppContact>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <div className="pb-16 md:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default Cart;
