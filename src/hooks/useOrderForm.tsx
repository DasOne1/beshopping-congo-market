
import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { toast } from '@/hooks/use-toast';
import React from 'react';

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}

interface UseOrderFormProps {
  onOrderComplete?: () => void;
  cartProducts?: any[];
  subtotal?: number;
  formatPrice?: (price: number) => string;
}

export const useOrderForm = ({ onOrderComplete, cartProducts, subtotal, formatPrice }: UseOrderFormProps = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const { createOrder } = useOrders();

  const createOrderInDB = async (customerData: CustomerInfo) => {
    const orderData = {
      customer_id: null,
      customer_name: customerData.name,
      customer_phone: customerData.phone,
      customer_email: null,
      shipping_address: { address: customerData.address },
      total_amount: subtotal || 0,
      subtotal: subtotal || 0,
      status: 'pending' as const,
    };

    const orderItems = cartProducts?.map(item => ({
      product_id: item.productId || item.id,
      product_name: item.product?.name || item.name || 'Produit',
      product_image: item.product?.images?.[0] || item.images?.[0] || '',
      quantity: item.quantity,
      unit_price: item.product?.discounted_price || item.product?.original_price || item.discounted_price || item.original_price || 0,
      total_price: (item.product?.discounted_price || item.product?.original_price || item.discounted_price || item.original_price || 0) * item.quantity,
    })) || [];

    await createOrder.mutateAsync({ order: orderData, items: orderItems });
    return { ...orderData, items: orderItems };
  };

  const handleSubmit = async (customerData: CustomerInfo) => {
    setIsSubmitting(true);
    
    try {
      await createOrderInDB(customerData);
      setOrderDetails({
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerAddress: customerData.address,
        total: formatPrice ? formatPrice(subtotal || 0) : `${subtotal || 0}`,
        orderType: 'form'
      });
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

  const handleWhatsAppOrder = async (customerData: CustomerInfo) => {
    try {
      // Générer le message WhatsApp immédiatement
      const message = generateWhatsAppMessage(customerData, cartProducts, subtotal, formatPrice);
      const whatsappUrl = `https://wa.me/243978100940?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      // Mettre à jour l'interface
      setOrderDetails({
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerAddress: customerData.address,
        total: formatPrice ? formatPrice(subtotal || 0) : `${subtotal || 0}`,
        orderType: 'whatsapp'
      });
      setShowConfirmation(true);

      // Créer la commande en arrière-plan
      await createOrderInDB(customerData);
      
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

  const whatsappMessage = React.useMemo(() => {
    const defaultData: CustomerInfo = {
      name: 'Client',
      phone: 'Non spécifié',
      address: 'Non spécifiée',
    };
    return generateWhatsAppMessage(defaultData, cartProducts, subtotal, formatPrice);
  }, [cartProducts, subtotal, formatPrice]);

  return {
    isSubmitting,
    showConfirmation,
    orderDetails,
    setShowConfirmation,
    handleSubmit,
    handleWhatsAppOrder,
    whatsappMessage,
    setOrderDetails
  };
};

const generateWhatsAppMessage = (
  data: CustomerInfo,
  cartProducts: any[] = [],
  subtotal: number = 0,
  formatPrice?: (price: number) => string
): string => {
  const formatPriceLocal = formatPrice || ((price: number) => `${price} FC`);
  
  let message = `🛒 *Nouvelle Commande - BeShopping Congo*\n\n`;
  message += `👤 *Client:* ${data.name}\n`;
  message += `📱 *Téléphone:* ${data.phone}\n`;
  message += `📍 *Adresse:* ${data.address}\n\n`;
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
