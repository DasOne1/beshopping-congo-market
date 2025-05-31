
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOrderForm } from '@/hooks/useOrderForm';
import { OrderFormFields } from '@/components/OrderFormFields';
import { OrderFormButtons } from '@/components/OrderFormButtons';
import { useCart } from '@/contexts/CartContext';
import { useTranslation } from 'react-i18next';

interface FormData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
}

const OrderForm = () => {
  const { items } = useCart();
  const { t } = useTranslation();
  
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    onWhatsAppSubmit
  } = useOrderForm();

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  const handleWhatsAppSubmit = (data: FormData) => {
    onWhatsAppSubmit(data);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('cart.deliveryInfo')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <OrderFormFields register={register} errors={errors} />
          <OrderFormButtons 
            onWhatsAppSubmit={handleSubmit(handleWhatsAppSubmit)}
            isSubmitting={isSubmitting}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
