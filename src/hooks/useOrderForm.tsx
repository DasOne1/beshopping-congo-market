
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOrders } from '@/hooks/useOrders';
import { toast } from '@/hooks/use-toast';

// Schema sans validation stricte pour permettre les champs optionnels
const orderFormSchema = z.object({
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  customerAddress: z.string().optional(),
});

// Schema strict pour la validation de la commande classique
const strictOrderFormSchema = z.object({
  customerName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  customerPhone: z.string().min(8, 'Le numéro de téléphone doit contenir au moins 8 chiffres'),
  customerAddress: z.string().min(10, 'L\'adresse doit contenir au moins 10 caractères'),
});

export type OrderFormData = z.infer<typeof strictOrderFormSchema>;

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
    const validation = strictOrderFormSchema.safeParse(values);
    
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

  const createOrderInDB = async (customerData: OrderFormData) => {
    const orderData = {
      customer_name: customerData.customerName,
      customer_phone: customerData.customerPhone,
      shipping_address: { address: customerData.customerAddress },
      total_amount: subtotal || 0,
      subtotal: subtotal || 0,
      status: 'pending' as const,
    };

    const orderItems = cartProducts?.map(item => ({
      product_id: item.productId || item.id,
      product_name: item.product?.name || item.name || 'Produit',
      product_image: item.product?.images?.[0] || item.images?.[0] || '',
      product_status: item.product?.status || 'active', // Ajout du statut du produit
      quantity: item.quantity,
      unit_price: item.product?.discounted_price || item.product?.original_price || item.discounted_price || item.original_price || 0,
      total_price: (item.product?.discounted_price || item.product?.original_price || item.discounted_price || item.original_price || 0) * item.quantity,
    })) || [];

    await createOrder.mutateAsync({ order: orderData, items: orderItems });
    return { ...orderData, items: orderItems };
  };

  const handleSubmit = async (data: OrderFormData) => {
    // Validation stricte pour la commande classique
    if (!validateFormBeforeAction()) return;
    
    setIsSubmitting(true);
    
    try {
      const orderDetails = await createOrderInDB(data);
      setOrderDetails(orderDetails);
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

  const handleWhatsAppOrder = async () => {
    try {
      // Créer la commande avec des données par défaut ou celles remplies
      const formValues = form.getValues();
      const defaultData: OrderFormData = {
        customerName: formValues.customerName || 'Anonyme',
        customerPhone: formValues.customerPhone || 'Non spécifié',
        customerAddress: formValues.customerAddress || 'Non spécifiée',
      };

      // Créer la commande en base avec les données par défaut
      await createOrderInDB(defaultData);

      // Générer le message WhatsApp
      const message = generateWhatsAppMessage(defaultData, cartProducts, subtotal, formatPrice);
      const whatsappUrl = `https://wa.me/243978100940?text=${encodeURIComponent(message)}`;
      
      // Rediriger vers WhatsApp
      window.open(whatsappUrl, '_blank');
      
      if (onOrderComplete) {
        onOrderComplete();
      }
    } catch (error) {
      console.error('Erreur lors de la création de la commande WhatsApp:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la commande.",
        variant: "destructive",
      });
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
    const product = item.product || item;
    const price = product.discounted_price || product.original_price;
    const total = price * item.quantity;
    const status = product.status || 'active';
    message += `${index + 1}. ${product.name}\n`;
    message += `   • Quantité: ${item.quantity}\n`;
    message += `   • Prix unitaire: ${formatPriceLocal(price)}\n`;
    message += `   • Statut: ${status}\n`;
    message += `   • Total: ${formatPriceLocal(total)}\n\n`;
  });
  
  message += `💰 *Total général: ${formatPriceLocal(subtotal)}*\n\n`;
  message += `📅 *Date: ${new Date().toLocaleDateString('fr-FR')}*`;
  
  return message;
};
