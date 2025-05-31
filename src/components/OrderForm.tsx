
import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
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

const orderFormSchema = z.object({
  customerName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  customerPhone: z.string().min(8, 'Le numéro de téléphone doit contenir au moins 8 chiffres').regex(/^[+]?[\d\s-()]+$/, 'Format de téléphone invalide'),
  customerAddress: z.string().min(10, 'L\'adresse doit contenir au moins 10 caractères'),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

const OrderForm = ({ onOrderComplete, cartProducts, subtotal, formatPrice }: OrderFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { toast } = useToast();
  const { createOrder } = useOrders();
  const { createCustomer } = useCustomers();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerAddress: '',
    },
  });

  const handleSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);

    try {
      // Créer le client d'abord
      const customerData = {
        name: data.customerName,
        phone: data.customerPhone,
        address: { street: data.customerAddress }
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
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        shipping_address: { street: data.customerAddress },
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
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        total: subtotal && formatPrice ? formatPrice(subtotal) : undefined,
        orderType: 'form' as const
      };

      setOrderDetails(details);
      setShowConfirmation(true);

      // Réinitialiser le formulaire
      form.reset();

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
    const formData = form.getValues();
    let message = `Bonjour, je souhaite passer une commande avec les informations suivantes:\n\nNom: ${formData.customerName}\nTéléphone: ${formData.customerPhone}\nAdresse: ${formData.customerAddress}`;
    
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
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: "Erreur",
        description: "Veuillez corriger les erreurs dans le formulaire avant de commander via WhatsApp.",
        variant: "destructive",
      });
      return;
    }

    const formData = form.getValues();

    try {
      // Créer le client d'abord
      const customerData = {
        name: formData.customerName,
        phone: formData.customerPhone,
        address: { street: formData.customerAddress }
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
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        whatsapp_number: formData.customerPhone,
        shipping_address: { street: formData.customerAddress },
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
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        total: subtotal && formatPrice ? formatPrice(subtotal) : undefined,
        orderType: 'whatsapp' as const
      };

      setOrderDetails(details);
      setShowConfirmation(true);

      // Réinitialiser le formulaire
      form.reset();

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Votre nom complet"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de téléphone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Votre numéro de téléphone"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse de livraison</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Votre adresse de livraison"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                  size="lg"
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
            </form>
          </Form>
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
