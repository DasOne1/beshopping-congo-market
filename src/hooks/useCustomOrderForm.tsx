/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { toast } from '@/hooks/use-toast';

interface CustomOrderData {
  name: string;
  description: string;
  budget: string;
  contactInfo: string;
  address: string;
  images: File[];
}

interface UseCustomOrderFormProps {
  onOrderComplete?: () => void;
  currentCustomer?: any;
}

export const useCustomOrderForm = ({ onOrderComplete, currentCustomer }: UseCustomOrderFormProps = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { createOrder } = useOrders();

  const validateForm = (formData: CustomOrderData): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du produit est requis",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.description.trim()) {
      toast({
        title: "Erreur",
        description: "La description est requise",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const createCustomOrderInDB = async (formData: CustomOrderData) => {
    const orderData = {
      customer_id: currentCustomer?.id || null,
      customer_name: currentCustomer?.name || formData.contactInfo || 'Client personnalisé',
      customer_phone: currentCustomer?.phone || formData.contactInfo || 'Non spécifié',
      customer_email: currentCustomer?.email || null,
      shipping_address: { address: currentCustomer?.address?.address || formData.address || 'Non spécifiée' },
      total_amount: parseFloat(formData.budget) || 0,
      subtotal: parseFloat(formData.budget) || 0,
      status: 'pending' as const,
    };

    const orderItems = [{
      product_id: null,
      product_name: formData.name,
      product_image: '',
      quantity: 1,
      unit_price: parseFloat(formData.budget) || 0,
      total_price: parseFloat(formData.budget) || 0,
      custom_description: formData.description,
    }];

    await createOrder.mutateAsync({ order: orderData, items: orderItems });
    return { ...orderData, items: orderItems };
  };

  const handleSubmit = async (formData: CustomOrderData) => {
    if (!validateForm(formData)) return;
    
    setIsSubmitting(true);
    
    try {
      const orderDetailsData = await createCustomOrderInDB(formData);
      setOrderDetails({
        customerName: currentCustomer?.name || formData.contactInfo || 'Client personnalisé',
        customerPhone: currentCustomer?.phone || formData.contactInfo || 'Non spécifié',
        customerAddress: currentCustomer?.address?.address || formData.address || 'Non spécifiée',
        productName: formData.name,
        description: formData.description,
        budget: formData.budget ? `${parseFloat(formData.budget).toLocaleString()} FC` : 'Non spécifié',
        orderType: 'form'
      });
      setShowConfirmation(true);
      
      toast({
        title: "Commande enregistrée",
        description: "Votre commande personnalisée a été enregistrée avec succès.",
      });
      
      if (onOrderComplete) {
        onOrderComplete();
      }
    } catch (error) {
      console.error('Erreur lors de la création de la commande personnalisée:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la commande.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = async (formData: CustomOrderData) => {
    try {
      // Créer la commande en arrière-plan
      await createCustomOrderInDB(formData);
      
      setOrderDetails({
        customerName: currentCustomer?.name || formData.contactInfo || 'Client personnalisé',
        customerPhone: currentCustomer?.phone || formData.contactInfo || 'Non spécifié',
        customerAddress: currentCustomer?.address?.address || formData.address || 'Non spécifiée',
        productName: formData.name,
        description: formData.description,
        budget: formData.budget ? `${parseFloat(formData.budget).toLocaleString()} FC` : 'Non spécifié',
        orderType: 'whatsapp'
      });
      setShowConfirmation(true);
      
      if (onOrderComplete) {
        onOrderComplete();
      }
    } catch (error) {
      console.error('Erreur lors de la création de la commande WhatsApp:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la commande WhatsApp.",
        variant: "destructive",
      });
    }
  };

  return {
    isSubmitting,
    showConfirmation,
    orderDetails,
    setShowConfirmation,
    handleSubmit,
    handleWhatsAppOrder,
    validateForm,
  };
}; 