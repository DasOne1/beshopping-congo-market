
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrderForm } from '@/hooks/useOrderForm';
import OrderFormFields from '@/components/OrderFormFields';
import OrderFormButtons from '@/components/OrderFormButtons';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from 'react-i18next';
import { FormData } from '@/hooks/useOrderForm';

const OrderForm = ({ cartProducts, subtotal, formatPrice }: { 
  cartProducts?: any[], 
  subtotal?: number, 
  formatPrice?: (price: number) => string 
}) => {
  const { cartItems } = useCart();
  const { t } = useTranslation();
  
  const {
    form,
    isSubmitting,
    onSubmit,
    onWhatsAppSubmit
  } = useOrderForm();

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const handleWhatsAppSubmit = () => {
    const formData = form.getValues();
    onWhatsAppSubmit(formData);
  };

  // Use props if provided, otherwise fall back to cart context
  const items = cartProducts || cartItems || [];

  if (items.length === 0) {
    return null;
  }

  // Generate WhatsApp message
  const whatsappMessage = cartProducts && subtotal && formatPrice 
    ? `Bonjour, je souhaite passer une commande.\n\nProduits:\n${cartProducts.map(item => 
        item.product ? `- ${item.product.name} x${item.quantity}` : ''
      ).join('\n')}\n\nTotal: ${formatPrice(subtotal)} FC`
    : 'Bonjour, je souhaite passer une commande.';

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('cart.deliveryInfo')}</CardTitle>
      </CardHeader>
      <CardContent>
        <OrderFormFields 
          form={form}
          onSubmit={handleFormSubmit}
        >
          <OrderFormButtons 
            isSubmitting={isSubmitting}
            whatsappMessage={whatsappMessage}
            onWhatsAppOrder={handleWhatsAppSubmit}
          />
        </OrderFormFields>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
