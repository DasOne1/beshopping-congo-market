
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrderForm } from '@/hooks/useOrderForm';
import OrderFormFields from '@/components/OrderFormFields';
import OrderFormButtons from '@/components/OrderFormButtons';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useCart } from '@/contexts/CartContext';

const OrderForm = () => {
  const { isAuthenticated, user } = useSupabaseAuth();
  const { cart: cartItems, clearCart } = useCart();
  
  const {
    form,
    isSubmitting,
    handleSubmit,
    handleWhatsAppOrder,
  } = useOrderForm({
    onOrderComplete: () => {
      clearCart();
    },
    cartProducts: cartItems,
    subtotal: 0, // This should be calculated based on cart items
    formatPrice: (price: number) => `${price.toLocaleString()} FC`,
    currentCustomer: user
  });

  // Calculate if form is valid
  const formValues = form.watch();
  const isFormValid = formValues.customerName && formValues.customerPhone && formValues.customerAddress;

  // Generate WhatsApp message
  const whatsappMessage = `Nouvelle commande de ${formValues.customerName || 'Client'}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finaliser votre commande</CardTitle>
        <CardDescription>
          Remplissez vos informations pour passer votre commande
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OrderFormFields
          form={form}
          onSubmit={handleSubmit}
        >
          <OrderFormButtons
            isSubmitting={isSubmitting}
            isFormValid={!!isFormValid}
            whatsappMessage={whatsappMessage}
            onWhatsAppOrder={handleWhatsAppOrder}
            isAuthenticated={isAuthenticated}
          />
        </OrderFormFields>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
