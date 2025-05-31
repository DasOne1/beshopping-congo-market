
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

  // Obtenir les valeurs du formulaire de manière sécurisée
  const formValues = form.watch();
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
