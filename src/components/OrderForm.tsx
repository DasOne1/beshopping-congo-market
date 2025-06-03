
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OrderFormFields from '@/components/OrderFormFields';
import OrderFormButtons from '@/components/OrderFormButtons';
import OrderConfirmationDialog from '@/components/OrderConfirmationDialog';
import { useOrderForm } from '@/hooks/useOrderForm';
import { generateWhatsAppMessage } from '@/utils/whatsappMessageGenerator';
import { useEnhancedCustomerAuth } from '@/hooks/useEnhancedCustomerAuth';

interface OrderFormProps {
  onOrderComplete?: () => void;
  cartProducts?: any[];
  subtotal?: number;
  formatPrice?: (price: number) => string;
}

const OrderForm = ({ onOrderComplete, cartProducts, subtotal, formatPrice }: OrderFormProps) => {
  const { currentCustomer, isAuthenticated } = useEnhancedCustomerAuth();
  
  const {
    form,
    isSubmitting,
    showConfirmation,
    orderDetails,
    setShowConfirmation,
    handleSubmit,
    handleWhatsAppOrder
  } = useOrderForm({ onOrderComplete, cartProducts, subtotal, formatPrice, currentCustomer });

  // Pré-remplir le formulaire avec les informations du client connecté
  useEffect(() => {
    if (isAuthenticated && currentCustomer) {
      console.log('Pré-remplissage du formulaire avec les données client:', currentCustomer);
      
      // Mettre à jour les champs du formulaire avec les données du client
      form.setValue('customerName', currentCustomer.name || '');
      form.setValue('customerPhone', currentCustomer.phone || '');
      form.setValue('customerAddress', currentCustomer.address || '');
      
      // Mettre à jour l'email si disponible
      if (currentCustomer.email) {
        form.setValue('customerEmail', currentCustomer.email);
      }
    }
  }, [isAuthenticated, currentCustomer, form]);

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
          {isAuthenticated && currentCustomer && (
            <p className="text-sm text-muted-foreground">
              Connecté en tant que <strong>{currentCustomer.name}</strong> - Vos informations ont été pré-remplies
            </p>
          )}
          {!isAuthenticated && (
            <p className="text-sm text-muted-foreground">
              Veuillez remplir vos informations de livraison
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
