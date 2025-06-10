
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

export const useOrderForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const submitOrder = async (data: OrderFormData) => {
    setIsSubmitting(true);
    try {
      // Logique de soumission
      console.log('Submitting order:', data);
      return data;
    } catch (error) {
      console.error('Error submitting order:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    submitOrder,
    formState: form.formState,
    watch: form.watch,
    setValue: form.setValue,
    getValues: form.getValues,
  };
};
