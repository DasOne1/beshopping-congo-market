
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrderFormFields from '@/components/OrderFormFields';
import OrderFormButtons from '@/components/OrderFormButtons';
import OrderConfirmationDialog from '@/components/OrderConfirmationDialog';
import { useOrderForm } from '@/hooks/useOrderForm';
import { generateWhatsAppMessage } from '@/utils/whatsappMessageGenerator';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

interface OrderFormProps {
  onOrderComplete?: () => void;
  cartProducts?: any[];
  subtotal?: number;
  formatPrice?: (price: number) => string;
}

const OrderForm = ({ onOrderComplete, cartProducts, subtotal, formatPrice }: OrderFormProps) => {
  const { currentCustomer, isAuthenticated } = useCustomerAuth();
  
  const {
    form,
    isSubmitting,
    showConfirmation,
    orderDetails,
    setShowConfirmation,
    handleSubmit,
    handleWhatsAppOrder
  } = useOrderForm({ onOrderComplete, cartProducts, subtotal, formatPrice, currentCustomer });

  // Observer les valeurs du formulaire pour la validation en temps réel
  const formValues = form.watch();
  
  // Vérifier si le formulaire est valide pour la commande classique
  const isFormValid = 
    formValues.customerName && formValues.customerName.length >= 2 &&
    formValues.customerPhone && formValues.customerPhone.length >= 8 &&
    formValues.customerAddress && formValues.customerAddress.length >= 10;

  const whatsappMessage = generateWhatsAppMessage(
    {
      customerName: formValues.customerName || 'Anonyme',
      customerPhone: formValues.customerPhone || 'Non spécifié',
      customerAddress: formValues.customerAddress || 'Non spécifiée'
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
          {isAuthenticated && (
            <p className="text-sm text-muted-foreground">
              Vos informations ont été pré-remplies depuis votre profil
            </p>
          )}
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
