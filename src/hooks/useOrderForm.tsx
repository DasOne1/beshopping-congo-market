
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/hooks/useOrders';

const orderFormSchema = z.object({
  customerName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  customerPhone: z.string().min(8, 'Le numéro de téléphone doit contenir au moins 8 caractères'),
  customerEmail: z.string().email('Email invalide').optional().or(z.literal('')),
  customerAddress: z.string().min(10, 'L\'adresse doit contenir au moins 10 caractères'),
  notes: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

interface UseOrderFormProps {
  onOrderComplete?: () => void;
  cartProducts?: any[];
  subtotal?: number;
  formatPrice?: (price: number) => string;
  currentCustomer?: any;
}

export const useOrderForm = ({ 
  onOrderComplete, 
  cartProducts = [], 
  subtotal = 0, 
  formatPrice,
  currentCustomer 
}: UseOrderFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
  const { clearCart } = useCart();
  const { createOrder } = useOrders();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerName: currentCustomer?.name || '',
      customerPhone: currentCustomer?.phone || '',
      customerEmail: currentCustomer?.email || '',
      customerAddress: currentCustomer?.address || '',
      notes: '',
    },
  });

  const handleSubmit = async (data: OrderFormData) => {
    if (cartProducts.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des produits à votre panier avant de commander.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Création de la commande avec les données:', data);
      
      // Préparer les données de la commande selon le format attendu par useOrders
      const orderData = {
        customer_id: currentCustomer?.id || null,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_email: data.customerEmail || null,
        customer_address: data.customerAddress,
        notes: data.notes || null,
        total_amount: subtotal,
        subtotal: subtotal,
        status: 'pending' as const
      };

      const orderItems = cartProducts.map(item => ({
        product_id: item.productId,
        product_name: item.product?.name || 'Produit inconnu',
        quantity: item.quantity,
        unit_price: item.product?.discounted_price || item.product?.original_price || 0,
        total_price: (item.product?.discounted_price || item.product?.original_price || 0) * item.quantity
      }));

      // Appeler createOrder avec le bon format
      const result = await createOrder.mutateAsync({ 
        order: orderData, 
        items: orderItems 
      });
      
      if (result) {
        console.log('Commande créée avec succès:', result);
        
        setOrderDetails({
          orderNumber: result.order_number,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerAddress: data.customerAddress,
          items: cartProducts,
          total: subtotal,
          formatPrice
        });
        
        setShowConfirmation(true);
        clearCart();
        
        if (onOrderComplete) {
          onOrderComplete();
        }
        
        toast({
          title: "Commande créée !",
          description: `Votre commande ${result.order_number} a été créée avec succès.`,
        });
      }
    } catch (error: any) {
      console.error('Erreur lors de la création de la commande:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la commande.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppOrder = () => {
    if (cartProducts.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des produits à votre panier avant de commander.",
        variant: "destructive",
      });
      return;
    }

    const formData = form.getValues();
    
    if (!formData.customerName || !formData.customerPhone || !formData.customerAddress) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir au moins le nom, téléphone et adresse.",
        variant: "destructive",
      });
      return;
    }

    // Construire le message WhatsApp
    let message = `🛒 *NOUVELLE COMMANDE*\n\n`;
    message += `👤 *Client:* ${formData.customerName}\n`;
    message += `📞 *Téléphone:* ${formData.customerPhone}\n`;
    message += `📍 *Adresse:* ${formData.customerAddress}\n`;
    
    if (formData.customerEmail) {
      message += `📧 *Email:* ${formData.customerEmail}\n`;
    }
    
    message += `\n📦 *Produits commandés:*\n`;
    
    cartProducts.forEach((item, index) => {
      const price = item.product?.discounted_price || item.product?.original_price || 0;
      const total = price * item.quantity;
      message += `${index + 1}. ${item.product?.name || 'Produit'}\n`;
      message += `   Quantité: ${item.quantity}\n`;
      message += `   Prix unitaire: ${formatPrice ? formatPrice(price) : price} FC\n`;
      message += `   Total: ${formatPrice ? formatPrice(total) : total} FC\n\n`;
    });
    
    message += `💰 *TOTAL: ${formatPrice ? formatPrice(subtotal) : subtotal} FC*\n\n`;
    
    if (formData.notes) {
      message += `📝 *Notes:* ${formData.notes}\n\n`;
    }
    
    message += `Merci de confirmer cette commande !`;

    // Encoder le message pour WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/243978100940?text=${encodedMessage}`;
    
    // Ouvrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Commande envoyée",
      description: "Votre commande a été envoyée via WhatsApp.",
    });
  };

  return {
    form,
    isSubmitting,
    showConfirmation,
    orderDetails,
    setShowConfirmation,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleWhatsAppOrder,
  };
};
