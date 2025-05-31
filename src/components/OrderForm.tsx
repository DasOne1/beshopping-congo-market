
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrderFormFields, { OrderFormData } from '@/components/OrderFormFields';
import OrderFormButtons from '@/components/OrderFormButtons';
import OrderConfirmationDialog from '@/components/OrderConfirmationDialog';
import { useOrderForm } from '@/hooks/useOrderForm';
import { generateWhatsAppMessage } from '@/utils/whatsappMessageGenerator';

interface OrderFormProps {
  onOrderComplete?: () => void;
  cartProducts?: any[];
  subtotal?: number;
  formatPrice?: (price: number) => string;
}

const OrderForm = ({ onOrderComplete, cartProducts, subtotal, formatPrice }: OrderFormProps) => {
  const {
    form,
    isSubmitting,
    showConfirmation,
    orderDetails,
    setShowConfirmation,
    handleSubmit,
    handleWhatsAppOrder
  } = useOrderForm({ onOrderComplete, cartProducts, subtotal, formatPrice });

  // Observer les valeurs du formulaire pour la validation en temps réel
  const formValues = form.watch();
  
  // Vérifier si le formulaire est valide
  const isFormValid = 
    formValues.customerName && formValues.customerName.length >= 2 &&
    formValues.customerPhone && formValues.customerPhone.length >= 8 &&
    formValues.customerAddress && formValues.customerAddress.length >= 10;

  const whatsappMessage = generateWhatsAppMessage(
    {
      customerName: formValues.customerName || '',
      customerPhone: formValues.customerPhone || '',
      customerAddress: formValues.customerAddress || ''
    },
    cartProducts,
    subtotal,
    formatPrice
  );

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Informations de livraison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <OrderFormFields form={form} onSubmit={handleSubmit}>
            <OrderFormButtons
              isSubmitting={isSubmitting}
              isFormValid={isFormValid}
              whatsappMessage={whatsappMessage}
              onWhatsAppOrder={handleWhatsAppOrder}
            />
          </OrderFormFields>
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
