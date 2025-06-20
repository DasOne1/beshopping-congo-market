
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import OrderSummary from '@/components/OrderSummary';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { toast } from '@/hooks/use-toast';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import WhatsAppConfirmationDialog from '@/components/WhatsAppConfirmationDialog';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { Product } from '@/types';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { formatPrice, formatCurrency } from '@/lib/utils';
import CustomerInfoModal from '@/components/CustomerInfoModal';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const { products } = useProducts();
  const navigate = useNavigate();
  const { sendWhatsAppMessage, closeConfirmation, showConfirmation: whatsappShowConfirmation, orderDetails: whatsappOrderDetails, generateCartOrderMessage } = useWhatsApp();
  const { createOrder } = useOrders();

  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Get cart products with full product data
  const cartProducts = cart.map(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);
    const typedProduct: Product = product ? {
      ...product,
      status: product.status as 'active' | 'inactive' | 'draft',
      category_id: product.category_id || '',
      description: product.description || '',
      tags: product.tags || [],
      stock: product.stock || 0,
      created_at: product.created_at || new Date().toISOString(),
      updated_at: product.updated_at || new Date().toISOString()
    } : {
      id: cartItem.productId,
      name: 'Produit non trouvé',
      description: '',
      original_price: 0,
      discounted_price: null,
      images: [],
      stock: 0,
      category_id: '',
      tags: [],
      featured: false,
      is_visible: true,
      status: 'inactive',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return {
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      product: typedProduct
    };
  });

  const subtotal = cartProducts.reduce((acc, item) => {
    return acc + (item.product.discounted_price || item.product.original_price) * item.quantity;
  }, 0);

  const handleDirectOrder = async (customerInfo: any) => {
    setIsSubmitting(true);
    
    try {
      const orderData = {
        customer_id: null,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_email: null,
        shipping_address: { address: customerInfo.address },
        total_amount: subtotal || 0,
        subtotal: subtotal || 0,
        status: 'pending' as const,
      };

      const orderItems = cartProducts.map(item => ({
        product_id: item.productId,
        product_name: item.product.name,
        product_image: item.product.images?.[0] || '',
        quantity: item.quantity,
        unit_price: item.product.discounted_price || item.product.original_price,
        total_price: (item.product.discounted_price || item.product.original_price) * item.quantity,
      }));

      await createOrder.mutateAsync({ order: orderData, items: orderItems });

      setOrderDetails({
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        total: formatPrice(subtotal),
        orderType: 'form'
      });
      
      setShowCustomerModal(false);
      setShowConfirmation(true);

      toast({
        title: "Commande enregistrée",
        description: "Votre commande a été enregistrée avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la commande.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = async (customerInfo: any) => {
    try {
      const message = generateCartOrderMessage(cartProducts, subtotal, {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address
      });

      sendWhatsAppMessage(message, {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        productName: `Commande panier (${cartProducts.length} produits)`,
        description: `Commande de ${cartProducts.length} produit(s) depuis le panier`,
        budget: formatPrice(subtotal)
      });

      // Enregistrer la commande en arrière-plan
      const orderData = {
        customer_id: null,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_email: null,
        shipping_address: { address: customerInfo.address },
        total_amount: subtotal || 0,
        subtotal: subtotal || 0,
        status: 'pending' as const,
      };

      const orderItems = cartProducts.map(item => ({
        product_id: item.productId,
        product_name: item.product.name,
        product_image: item.product.images?.[0] || '',
        quantity: item.quantity,
        unit_price: item.product.discounted_price || item.product.original_price,
        total_price: (item.product.discounted_price || item.product.original_price) * item.quantity,
      }));

      await createOrder.mutateAsync({ order: orderData, items: orderItems });
      setShowCustomerModal(false);
    } catch (error) {
      console.error('Erreur lors de la création de la commande WhatsApp:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la commande WhatsApp.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-20 md:pt-24">
        <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>
        
        {cartProducts.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Votre panier est vide</h2>
            <p className="text-gray-600 mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
            <Link to="/products">
              <Button>Voir nos produits</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartProducts.map((item) => (
                <Card key={item.productId}>
                  <CardHeader>
                    <CardTitle>{item.product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-4 gap-4">
                    <div className="col-span-1">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-24 object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-24 bg-gray-200 rounded flex items-center justify-center">
                          <ShoppingCart className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="col-span-3 space-y-2">
                      <p className="text-sm text-muted-foreground">{item.product.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.productId)}>
                          Supprimer
                        </Button>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency((item.product.discounted_price || item.product.original_price) * item.quantity, item.product.currency || 'CDF')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="space-y-6">
              <OrderSummary
                cartProducts={cartProducts}
                subtotal={subtotal}
                formatPrice={formatPrice}
              />
              
              <div className="space-y-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setShowCustomerModal(true)}
                  disabled={isSubmitting}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Passer la commande
                </Button>

                <Link to="/products" className="block">
                  <Button variant="outline" className="w-full">
                    Continuer mes achats
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <CustomerInfoModal
          open={showCustomerModal}
          onOpenChange={setShowCustomerModal}
          onSubmit={handleDirectOrder}
          onWhatsAppSubmit={handleWhatsAppOrder}
          isSubmitting={isSubmitting}
        />

        <WhatsAppConfirmationDialog
          open={showConfirmation || whatsappShowConfirmation}
          onOpenChange={(open) => {
            if (!open) {
              setShowConfirmation(false);
              closeConfirmation();
            }
          }}
          orderDetails={orderDetails || whatsappOrderDetails}
          message={orderDetails?.orderType === 'whatsapp' ? generateCartOrderMessage(cartProducts, subtotal, {
            customerName: orderDetails?.customerName || 'Anonyme',
            customerPhone: orderDetails?.customerPhone || 'Non spécifié',
            customerAddress: orderDetails?.customerAddress || 'Non spécifiée'
          }) : undefined}
          onClose={() => {
            setShowConfirmation(false);
            closeConfirmation();
          }}
        />
      </main>
      <div className="pb-16 md:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default Cart;
