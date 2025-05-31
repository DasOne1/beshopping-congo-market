
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateWhatsAppMessage } from '@/utils/whatsappMessageGenerator';
import { useTranslation } from 'react-i18next';

const formSchema = z.object({
  customerName: z.string().min(2, 'form.minLength'),
  customerPhone: z.string().min(8, 'form.minLength').regex(/^[+]?[\d\s\-()]+$/, 'form.invalidPhone'),
  customerAddress: z.string().min(10, 'form.minLength'),
});

export type FormData = z.infer<typeof formSchema>;

export const useOrderForm = () => {
  const { items, clearCart } = useCart();
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerAddress: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const orderData = {
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_address: data.customerAddress,
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          price: item.original_price,
          quantity: item.quantity,
          subtotal: item.original_price * item.quantity,
        })),
        total: items.reduce((sum, item) => sum + (item.original_price * item.quantity), 0),
        status: 'pending',
      };

      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) throw error;

      toast({
        title: t('toast.orderCreated'),
        description: t('toast.orderSuccess'),
      });

      clearCart();
      form.reset();
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: t('toast.error'),
        description: 'Une erreur est survenue lors de la création de la commande.',
        variant: 'destructive',
      });
    }
  };

  const onWhatsAppSubmit = (data: FormData) => {
    if (!form.formState.isValid) {
      toast({
        title: t('toast.error'),
        description: t('toast.formError'),
        variant: 'destructive',
      });
      return;
    }

    const message = generateWhatsAppMessage(data, items);
    const phoneNumber = '+243970284772';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: t('toast.whatsappOrderCreated'),
      description: t('toast.whatsappOrderSuccess'),
    });

    clearCart();
    form.reset();
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    onSubmit,
    onWhatsAppSubmit,
  };
};
