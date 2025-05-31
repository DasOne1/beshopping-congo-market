
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useOrders } from '@/hooks/useOrders';
import { useCustomers } from '@/hooks/useCustomers';
import { OrderFormData } from '@/components/OrderFormFields';

const orderFormSchema = z.object({
  customerName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  customerPhone: z.string().min(8, 'Le numéro de téléphone doit contenir au moins 8 chiffres').regex(/^[+]?[\d\s-()]+$/, 'Format de téléphone invalide'),
  customerAddress: z.string().min(10, 'L\'adresse doit contenir au moins 10 caractères'),
});

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
  const { toast } = useToast();
  const { createOrder } = useOrders();
  const { createCustomer } = useCustomers();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      customerAddress: '',
    },
  });

  const createOrderData = async (data: OrderFormData) => {
    // Créer le client d'abord
    const customerData = {
      name: data.customerName,
      phone: data.customerPhone,
      address: { street: data.customerAddress }
    };

    const newCustomer = await createCustomer.mutateAsync(customerData);

    // Préparer les articles de la commande
    const orderItems = cartProducts?.map(item => ({
      product_id: item.product?.id,
      product_name: item.product?.name || 'Produit inconnu',
      product_image: item.product?.images?.[0],
      quantity: item.quantity,
      unit_price: item.product?.discounted_price || item.product?.original_price || 0,
      total_price: (item.product?.discounted_price || item.product?.original_price || 0) * item.quantity
    })) || [];

    return { newCustomer, orderItems };
  };

  const validateFormBeforeAction = async (): Promise<boolean> => {
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires avant de continuer.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (data: OrderFormData) => {
    const isValid = await validateFormBeforeAction();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const { newCustomer, orderItems } = await createOrderData(data);

      // Créer la commande
      const orderData = {
        customer_id: newCustomer.id,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        shipping_address: { street: data.customerAddress },
        subtotal: subtotal || 0,
        total_amount: subtotal || 0,
        status: 'pending' as const,
        payment_status: 'pending'
      };

      await createOrder.mutateAsync({
        order: orderData,
        items: orderItems
      });

      // Préparer les détails de la commande pour la confirmation
      const details = {
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        total: subtotal && formatPrice ? formatPrice(subtotal) : undefined,
        orderType: 'form' as const
      };

      setOrderDetails(details);
      setShowConfirmation(true);

      // Réinitialiser le formulaire
      form.reset();

      if (onOrderComplete) {
        onOrderComplete();
      }

      toast({
        title: "Commande créée",
        description: "Votre commande a été enregistrée avec succès !",
      });

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la commande.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = async () => {
    const isValid = await validateFormBeforeAction();
    if (!isValid) return;

    const formData = form.getValues();

    try {
      const { newCustomer, orderItems } = await createOrderData(formData);

      // Créer la commande WhatsApp
      const orderData = {
        customer_id: newCustomer.id,
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        whatsapp_number: formData.customerPhone,
        shipping_address: { street: formData.customerAddress },
        subtotal: subtotal || 0,
        total_amount: subtotal || 0,
        status: 'pending' as const,
        payment_status: 'pending'
      };

      await createOrder.mutateAsync({
        order: orderData,
        items: orderItems
      });

      // Préparer les détails de la commande WhatsApp
      const details = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerAddress: formData.customerAddress,
        total: subtotal && formatPrice ? formatPrice(subtotal) : undefined,
        orderType: 'whatsapp' as const
      };

      setOrderDetails(details);
      setShowConfirmation(true);

      // Réinitialiser le formulaire
      form.reset();

      if (onOrderComplete) {
        onOrderComplete();
      }

      toast({
        title: "Commande WhatsApp créée",
        description: "Votre commande a été enregistrée et sera envoyée via WhatsApp !",
      });

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création de la commande WhatsApp.",
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
    handleWhatsAppOrder
  };
};

export type { OrderFormData };
