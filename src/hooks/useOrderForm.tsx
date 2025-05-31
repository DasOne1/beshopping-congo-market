
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOrders } from '@/hooks/useOrders';
import { toast } from '@/hooks/use-toast';

const orderFormSchema = z.object({
  customerName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  customerPhone: z.string().min(8, 'Le numéro de téléphone doit contenir au moins 8 chiffres'),
  customerAddress: z.string().min(10, 'L\'adresse doit contenir au moins 10 caractères'),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;

interface UseOrderFormProps {
  onOrderComplete?: () => void;
  cartProducts?: any[];
  subtotal?: number;
  formatPrice?: (price: number) => string;
}

export const useOrderForm = ({ onOrderComplete, cartProducts, subtotal, formatPrice }: UseOrderFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { createOrder } = useOrders();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerAddress: '',
    },
  });

  const validateFormBeforeAction = (): boolean => {
    const values = form.getValues();
    const validation = orderFormSchema.safeParse(values);
    
    if (!validation.success) {
      // Afficher les erreurs de validation dans le formulaire
      validation.error.errors.forEach((error) => {
        form.setError(error.path[0] as keyof OrderFormData, {
          message: error.message
        });
      });
      
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs requis du formulaire.",
        variant: "destructive",
      });
      
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (data: OrderFormData) => {
    if (!validateFormBeforeAction()) return;
    
    setIsSubmitting(true);
    
    try {
      // Créer la commande
      const orderData = {
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        shipping_address: { address: data.customerAddress },
        total_amount: subtotal || 0,
        subtotal: subtotal || 0,
        status: 'pending' as const,
      };

      const orderItems = cartProducts?.map(item => ({
        product_id: item.id,
        product_name: item.name,
        product_image: item.images?.[0] || '',
        quantity: item.quantity,
        unit_price: item.discounted_price || item.original_price,
        total_price: (item.discounted_price || item.original_price) * item.quantity,
      })) || [];

      await createOrder.mutateAsync({ order: orderData, items: orderItems });
      
      setOrderDetails({ ...orderData, items: orderItems });
      setShowConfirmation(true);
      
      if (onOrderComplete) {
        onOrderComplete();
      }
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la commande.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = () => {
    // Validation complète du formulaire AVANT toute action
    if (!validateFormBeforeAction()) {
      // Si le formulaire n'est pas valide, on s'arrête ici
      // L'utilisateur reste sur la même page
      return;
    }
    
    // Le formulaire est valide, on peut procéder à la redirection
    const data = form.getValues();
    const message = generateWhatsAppMessage(data, cartProducts, subtotal, formatPrice);
    const whatsappUrl = `https://wa.me/243978100940?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    if (onOrderComplete) {
      onOrderComplete();
    }
  };

  return {
    form,
    isSubmitting,
    showConfirmation,
    orderDetails,
    setShowConfirmation,
    handleSubmit,
    handleWhatsAppOrder,
    validateFormBeforeAction,
  };
};

const generateWhatsAppMessage = (
  data: OrderFormData,
  cartProducts: any[] = [],
  subtotal: number = 0,
  formatPrice?: (price: number) => string
): string => {
  const formatPriceLocal = formatPrice || ((price: number) => `${price} FC`);
  
  let message = `🛒 *Nouvelle Commande - BeShopping Congo*\n\n`;
  message += `👤 *Client:* ${data.customerName}\n`;
  message += `📱 *Téléphone:* ${data.customerPhone}\n`;
  message += `📍 *Adresse:* ${data.customerAddress}\n\n`;
  message += `🛍️ *Produits commandés:*\n`;
  
  cartProducts.forEach((item, index) => {
    const price = item.discounted_price || item.original_price;
    const total = price * item.quantity;
    message += `${index + 1}. ${item.name}\n`;
    message += `   • Quantité: ${item.quantity}\n`;
    message += `   • Prix unitaire: ${formatPriceLocal(price)}\n`;
    message += `   • Total: ${formatPriceLocal(total)}\n\n`;
  });
  
  message += `💰 *Total général: ${formatPriceLocal(subtotal)}*\n\n`;
  message += `📅 *Date: ${new Date().toLocaleDateString('fr-FR')}*`;
  
  return message;
};
