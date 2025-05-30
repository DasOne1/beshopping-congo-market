
import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from '@/hooks/useOrders';
import { useCustomers } from '@/hooks/useCustomers';
import WhatsAppContact from '@/components/WhatsAppContact';
import OrderConfirmationDialog from '@/components/OrderConfirmationDialog';

interface OrderFormProps {
  onOrderComplete?: () => void;
  cartProducts?: any[];
  subtotal?: number;
  formatPrice?: (price: number) => string;
}

const OrderForm = ({ onOrderComplete, cartProducts, subtotal, formatPrice }: OrderFormProps) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { toast } = useToast();
  const { createOrder } = useOrders();
  const { createCustomer } = useCustomers();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!customerName || !customerPhone || !customerAddress) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Créer le client d'abord
      const customerData = {
        name: customerName,
        phone: customerPhone,
        address: { street: customerAddress }
      };

      const newCustomer = await createCustomer.mutateAsync(customerData);

      // Préparer les articles de la commande
      const orderItems = cartProducts?.map(item => ({
        product_id: item.product?.id,
        product_name: item.product?.name || 'Produit inconnu',
        product_image: item.product?.images?.[0],
        quantity: item.quantity,
        unit_price: item.product?.discounted_price || item.product?.original_price || 0,
        total_price: (item.product?.discounted_price || item.product?.original_price || 0) * item.quantity
      })) || [];

      // Créer la commande
      const orderData = {
        customer_id: newCustomer.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        shipping_address: { street: customerAddress },
        subtotal: subtotal || 0,
        total_amount: subtotal || 0,
        status: 'pending' as const,
        payment_status: 'pending'
      };

      await createOrder.mutateAsync({
        order: orderData,
        items: orderItems
      });

      // Préparer les détails de la commande pour la confirmation
      const details = {
        customerName,
        customerPhone,
        customerAddress,
        total: subtotal && formatPrice ? formatPrice(subtotal) : undefined,
        orderType: 'form' as const
      };

      setOrderDetails(details);
      setShowConfirmation(true);

      // Réinitialiser le formulaire
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');

      if (onOrderComplete) {
        onOrderComplete();
      }

      toast({
        title: "Commande créée",
        description: "Votre commande a été enregistrée avec succès !",
      });

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la commande.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppMessage = () => {
    let message = `Bonjour, je souhaite passer une commande avec les informations suivantes:\n\nNom: ${customerName}\nTéléphone: ${customerPhone}\nAdresse: ${customerAddress}`;
    
    if (cartProducts && cartProducts.length > 0) {
      message += '\n\nProduits commandés:';
      cartProducts.forEach(item => {
        if (item.product) {
          const price = item.product.discounted_price || item.product.original_price;
          const itemTotal = formatPrice ? formatPrice(price * item.quantity) : (price * item.quantity);
          message += `\n- ${item.product.name} x${item.quantity} = ${itemTotal} FC`;
        }
      });
      
      if (subtotal && formatPrice) {
        message += `\n\nTotal: ${formatPrice(subtotal)} FC`;
      }
    }
    
    return message;
  };

  const handleWhatsAppOrder = async () => {
    if (!customerName || !customerPhone || !customerAddress) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs avant de commander via WhatsApp.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Créer le client d'abord
      const customerData = {
        name: customerName,
        phone: customerPhone,
        address: { street: customerAddress }
      };

      const newCustomer = await createCustomer.mutateAsync(customerData);

      // Préparer les articles de la commande
      const orderItems = cartProducts?.map(item => ({
        product_id: item.product?.id,
        product_name: item.product?.name || 'Produit inconnu',
        product_image: item.product?.images?.[0],
        quantity: item.quantity,
        unit_price: item.product?.discounted_price || item.product?.original_price || 0,
        total_price: (item.product?.discounted_price || item.product?.original_price || 0) * item.quantity
      })) || [];

      // Créer la commande WhatsApp
      const orderData = {
        customer_id: newCustomer.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        whatsapp_number: customerPhone,
        shipping_address: { street: customerAddress },
        subtotal: subtotal || 0,
        total_amount: subtotal || 0,
        status: 'pending' as const,
        payment_status: 'pending'
      };

      await createOrder.mutateAsync({
        order: orderData,
        items: orderItems
      });

      // Préparer les détails de la commande WhatsApp
      const details = {
        customerName,
        customerPhone,
        customerAddress,
        total: subtotal && formatPrice ? formatPrice(subtotal) : undefined,
        orderType: 'whatsapp' as const
      };

      setOrderDetails(details);
      setShowConfirmation(true);

      // Réinitialiser le formulaire
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');

      if (onOrderComplete) {
        onOrderComplete();
      }

      toast({
        title: "Commande WhatsApp créée",
        description: "Votre commande a été enregistrée et sera envoyée via WhatsApp !",
      });

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la commande WhatsApp.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Informations de livraison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                placeholder="Votre nom complet"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                placeholder="Votre numéro de téléphone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="address">Adresse de livraison</Label>
              <Input
                id="address"
                placeholder="Votre adresse de livraison"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Passer la commande
                </>
              )}
            </Button>

            <div className="text-center text-sm text-gray-500">ou</div>

            <WhatsAppContact
              phoneNumber="243978100940"
              message={generateWhatsAppMessage()}
              className="w-full bg-whatsapp hover:bg-whatsapp-dark text-white"
              size="lg"
              children="Commander via WhatsApp"
              onCustomClick={handleWhatsAppOrder}
            />
          </div>
        </CardContent>
      </Card>

      <OrderConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        orderDetails={orderDetails}
      />
    </>
  );
};

export default OrderForm;
