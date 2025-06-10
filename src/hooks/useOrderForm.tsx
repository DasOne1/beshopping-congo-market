
import { useState, useEffect } from 'react';
import { useCartContext } from '@/contexts/CartContext';
import { useOrders } from '@/hooks/useOptimizedOrders';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface OrderFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  whatsappNumber: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  notes: string;
}

export const useOrderForm = () => {
  const { cartItems, totalAmount, clearCart } = useCartContext();
  const { createOrder } = useOrders();
  
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    whatsappNumber: '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Congo (RDC)',
    },
    paymentMethod: 'cash',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      toast({
        title: "Panier vide",
        description: "Ajoutez des produits au panier avant de passer commande",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculer les totaux
      const subtotal = totalAmount;
      const taxAmount = subtotal * 0.1; // 10% de taxe
      const shippingAmount = 5000; // Frais de livraison fixes
      const finalTotal = subtotal + taxAmount + shippingAmount;

      // Créer la commande
      const orderData = {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        customer_phone: formData.customerPhone,
        whatsapp_number: formData.whatsappNumber,
        total_amount: finalTotal,
        subtotal: subtotal,
        tax_amount: taxAmount,
        shipping_amount: shippingAmount,
        discount_amount: 0,
        status: 'pending',
        payment_method: formData.paymentMethod,
        payment_status: 'pending',
        shipping_address: formData.shippingAddress,
        notes: formData.notes,
      };

      await createOrder.mutateAsync(orderData);

      // Vider le panier
      clearCart();
      
      // Réinitialiser le formulaire
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        whatsappNumber: '',
        shippingAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'Congo (RDC)',
        },
        paymentMethod: 'cash',
        notes: '',
      });

      toast({
        title: "Commande créée",
        description: "Votre commande a été créée avec succès",
      });

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof OrderFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateShippingAddress = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value,
      },
    }));
  };

  return {
    formData,
    updateFormData,
    updateShippingAddress,
    handleSubmit,
    isSubmitting,
    cartItems,
    totalAmount,
  };
};
