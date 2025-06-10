
import { useState, FormEvent } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/hooks/useOptimizedOrders';
import { generateWhatsAppMessage } from '@/utils/whatsappMessageGenerator';

export interface OrderFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  whatsapp_number: string;
  payment_method: string;
  notes: string;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export const useOrderForm = () => {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { createOrder } = useOrders();
  
  const [formData, setFormData] = useState<OrderFormData>({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    whatsapp_number: '',
    payment_method: 'cash',
    notes: '',
    shipping_address: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Congo'
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const updateFormData = (field: keyof OrderFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateShippingAddress = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      shipping_address: { ...prev.shipping_address, [field]: value }
    }));
  };

  const validateForm = () => {
    return formData.customer_name && formData.customer_phone && cartItems.length > 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const orderData = {
        ...formData,
        total_amount: totalAmount,
        subtotal: totalAmount,
        status: 'pending' as const,
        order_items: cartItems.map((item: any) => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.original_price,
          total_price: item.original_price * item.quantity,
          product_image: item.images?.[0] || ''
        }))
      };

      const result = await createOrder.mutateAsync(orderData);
      setOrderDetails(result);
      setShowConfirmation(true);
      clearCart();
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage(orderDetails, cartItems);
    const whatsappUrl = `https://wa.me/${formData.whatsapp_number || formData.customer_phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const whatsappMessage = orderDetails ? generateWhatsAppMessage(orderDetails, cartItems) : '';

  return {
    formData,
    updateFormData,
    updateShippingAddress,
    handleSubmit,
    isSubmitting,
    cartItems,
    totalAmount,
    form: formData,
    showConfirmation,
    orderDetails,
    setShowConfirmation,
    setOrderDetails,
    handleWhatsAppOrder,
    validateForm,
    whatsappMessage,
  };
};
