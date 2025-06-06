
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrderFormFields from '@/components/OrderFormFields';
import OrderFormButtons from '@/components/OrderFormButtons';
import { useOrderForm } from '@/hooks/useOrderForm';
import { useEmailAuth } from '@/hooks/useEmailAuth';

const OrderForm = () => {
  const { isAuthenticated } = useEmailAuth();
  const {
    form,
    isSubmitting,
    showConfirmation,
    orderDetails,
    setShowConfirmation,
    handleSubmit,
    handleWhatsAppOrder,
    validateForm,
    whatsappMessage
  } = useOrderForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de commande</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <OrderFormFields form={form} />
        
        <OrderFormButtons
          isSubmitting={isSubmitting}
          isFormValid={validateForm()}
          whatsappMessage={whatsappMessage}
          onWhatsAppOrder={handleWhatsAppOrder}
          isAuthenticated={isAuthenticated}
          showConfirmation={showConfirmation}
          orderDetails={orderDetails}
          setShowConfirmation={setShowConfirmation}
          handleSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  );
};

export default OrderForm;
