
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateWhatsAppMessage } from '@/utils/whatsappMessageGenerator';
import { CartItem } from '@/contexts/CartContext';

const orderSchema = z.object({
  customer_name: z.string().min(1, 'Le nom est requis'),
  customer_phone: z.string().min(1, 'Le téléphone est requis'),
  customer_email: z.string().email('Email invalide').optional().or(z.literal('')),
  whatsapp_number: z.string().optional(),
  shipping_address: z.object({
    street: z.string().min(1, 'L\'adresse est requise'),
    city: z.string().min(1, 'La ville est requise'),
    state: z.string().optional(),
    postal_code: z.string().optional(),
    country: z.string().default('RD Congo'),
  }),
  notes: z.string().optional(),
  payment_method: z.enum(['cash', 'mobile_money', 'bank_transfer']).default('cash'),
});

export type OrderFormData = z.infer<typeof orderSchema>;

export const useOrderForm = (cartItems: CartItem[] = []) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [whatsappMessage, setWhatsappMessage] = useState('');

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      whatsapp_number: '',
      shipping_address: {
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'RD Congo',
      },
      notes: '',
      payment_method: 'cash',
    },
  });

  const validateForm = () => {
    return form.trigger();
  };

  const submitOrder = async (data: OrderFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting order:', data);
      
      const orderData = {
        ...data,
        cartItems,
        total: cartItems.reduce((sum, item) => {
          const price = item.product.discounted_price || item.product.original_price;
          return sum + (price * item.quantity);
        }, 0),
      };
      
      setOrderDetails(orderData);
      
      // Générer le message WhatsApp
      const message = generateWhatsAppMessage(cartItems, data);
      setWhatsappMessage(message);
      
      setShowConfirmation(true);
      return orderData;
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = form.handleSubmit(submitOrder);

  const handleWhatsAppOrder = () => {
    const phoneNumber = "243123456789"; // Numéro par défaut
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return {
    form,
    isSubmitting,
    submitOrder,
    formState: form.formState,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
    showConfirmation,
    setShowConfirmation,
    orderDetails,
    setOrderDetails,
    handleSubmit,
    handleWhatsAppOrder,
    validateForm,
    whatsappMessage,
  };
};
