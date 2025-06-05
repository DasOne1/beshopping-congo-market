import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrderForm } from '@/hooks/useOrderForm';
import OrderFormFields from '@/components/OrderFormFields';
import OrderFormButtons from '@/components/OrderFormButtons';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const OrderForm = () => {
  const { isAuthenticated } = useSupabaseAuth();
  const {
    formData,
    setFormData,
    isSubmitting,
    isFormValid,
    whatsappMessage,
    handleSubmit,
    handleWhatsAppOrder
  } = useOrderForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finaliser votre commande</CardTitle>
        <CardDescription>
          Remplissez vos informations pour passer votre commande
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <OrderFormFields
            formData={formData}
            setFormData={setFormData}
          />
          
          <OrderFormButtons
            isSubmitting={isSubmitting}
            isFormValid={isFormValid}
            whatsappMessage={whatsappMessage}
            onWhatsAppOrder={handleWhatsAppOrder}
            isAuthenticated={isAuthenticated}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
