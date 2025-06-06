
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrderFormFields from '@/components/OrderFormFields';
import OrderFormButtons from '@/components/OrderFormButtons';
import { useOrderForm } from '@/hooks/useOrderForm';
import { useEmailAuth } from '@/hooks/useEmailAuth';

const OrderForm = () => {
  const { isAuthenticated } = useEmailAuth();
  const {
    orderData,
    updateOrderData,
    isSubmitting,
    isFormValid,
    submitOrder,
    whatsappMessage
  } = useOrderForm();

  const handleWhatsAppOrder = async () => {
    await submitOrder(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de commande</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <OrderFormFields
          orderData={orderData}
          updateOrderData={updateOrderData}
        />
        
        <OrderFormButtons
          isSubmitting={isSubmitting}
          isFormValid={isFormValid}
          whatsappMessage={whatsappMessage}
          onWhatsAppOrder={handleWhatsAppOrder}
          isAuthenticated={isAuthenticated}
        />
      </CardContent>
    </Card>
  );
};

export default OrderForm;
