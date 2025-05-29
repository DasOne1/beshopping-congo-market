
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCustomers } from '@/hooks/useCustomers';
import { useOrders } from '@/hooks/useOrders';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/components/ui/use-toast';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

interface OrderFormProps {
  cartProducts: any[];
  subtotal: number;
  formatPrice: (price: number) => string;
}

interface CustomerData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const OrderForm = ({ cartProducts, subtotal, formatPrice }: OrderFormProps) => {
  const { customers, createCustomer, updateCustomerStats } = useCustomers();
  const { createOrder } = useOrders();
  const { cart, clearCart } = useCart();
  
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [orderNotes, setOrderNotes] = useState(
    'Commande passée via le site web. Merci de confirmer la disponibilité des articles et les modalités de livraison.'
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setCustomerData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!customerData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom complet est requis",
        variant: "destructive",
      });
      return false;
    }
    
    if (!customerData.phone.trim()) {
      toast({
        title: "Erreur",
        description: "Le numéro de téléphone est requis",
        variant: "destructive",
      });
      return false;
    }
    
    if (!customerData.address.trim()) {
      toast({
        title: "Erreur",
        description: "L'adresse est requise",
        variant: "destructive",
      });
      return false;
    }

    if (cartProducts.length === 0) {
      toast({
        title: "Erreur",
        description: "Votre panier est vide",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const findOrCreateCustomer = async () => {
    try {
      // Chercher un client existant par téléphone ou email
      const existingCustomer = customers.find(customer => 
        (customer.phone && customer.phone === customerData.phone) ||
        (customer.email && customerData.email && customer.email === customerData.email)
      );

      if (existingCustomer) {
        console.log('Client existant trouvé:', existingCustomer);
        return existingCustomer.id;
      }

      // Créer un nouveau client seulement si aucun client existant n'est trouvé
      const newCustomer = await createCustomer.mutateAsync({
        name: customerData.name,
        email: customerData.email || undefined,
        phone: customerData.phone,
        address: {
          full_address: customerData.address
        },
        status: 'active',
        total_spent: 0,
        orders_count: 0
      });
      
      console.log('Nouveau client créé:', newCustomer);
      return newCustomer.id;
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
      throw new Error('Impossible de créer ou trouver le client');
    }
  };

  const handleSubmitOrder = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      console.log('Début du processus de commande...');

      // 1. Trouver ou créer le client
      const customerId = await findOrCreateCustomer();
      console.log('Client ID obtenu:', customerId);

      // 2. Préparer les articles de la commande
      const orderItems = cartProducts.map(item => {
        if (!item.product) return null;
        const price = item.product.discounted_price || item.product.original_price;
        
        return {
          product_id: item.product.id,
          product_name: item.product.name,
          product_image: item.product.images[0] || null,
          quantity: item.quantity,
          unit_price: price,
          total_price: price * item.quantity
        };
      }).filter(Boolean);

      console.log('Articles de commande préparés:', orderItems);

      // 3. Créer la commande
      const orderData = {
        customer_id: customerId,
        customer_name: customerData.name,
        customer_email: customerData.email || undefined,
        customer_phone: customerData.phone,
        whatsapp_number: customerData.phone,
        shipping_address: {
          full_address: customerData.address
        },
        subtotal: subtotal,
        total_amount: subtotal,
        tax_amount: 0,
        shipping_amount: 0,
        discount_amount: 0,
        status: 'pending' as const,
        payment_method: 'whatsapp',
        payment_status: 'pending',
        notes: orderNotes
      };

      console.log('Données de commande préparées:', orderData);

      const newOrder = await createOrder.mutateAsync({
        order: orderData,
        items: orderItems
      });

      console.log('Commande créée avec succès:', newOrder);

      // 4. Mettre à jour les statistiques du client
      await updateCustomerStats.mutateAsync({
        customerId: customerId,
        orderAmount: subtotal
      });

      console.log('Statistiques client mises à jour');

      // 5. Préparer le message WhatsApp
      let whatsappMessage = `Bonjour! Voici ma commande #${newOrder.order_number}:\n\n`;
      whatsappMessage += `📋 *Détails de la commande:*\n`;
      
      cartProducts.forEach(item => {
        if (!item.product) return;
        const price = item.product.discounted_price || item.product.original_price;
        whatsappMessage += `• ${item.product.name} x ${item.quantity} = ${formatPrice(price * item.quantity)} FC\n`;
      });
      
      whatsappMessage += `\n💰 *Total: ${formatPrice(subtotal)} FC*\n\n`;
      whatsappMessage += `👤 *Informations client:*\n`;
      whatsappMessage += `Nom: ${customerData.name}\n`;
      whatsappMessage += `Téléphone: ${customerData.phone}\n`;
      if (customerData.email) whatsappMessage += `Email: ${customerData.email}\n`;
      whatsappMessage += `Adresse: ${customerData.address}\n\n`;
      if (orderNotes) whatsappMessage += `📝 *Notes:* ${orderNotes}\n\n`;
      whatsappMessage += `Merci de confirmer la commande et les modalités de livraison.`;

      // 6. Vider le panier
      clearCart();

      // 7. Ouvrir WhatsApp directement
      const encodedMessage = encodeURIComponent(whatsappMessage);
      window.open(`https://wa.me/243978100940?text=${encodedMessage}`, '_blank');

      toast({
        title: "Commande créée avec succès!",
        description: `Votre commande #${newOrder.order_number} a été enregistrée et vous êtes redirigé vers WhatsApp`,
      });

    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
      toast({
        title: "Erreur",
        description: `Impossible de créer la commande: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Finaliser la commande</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet *</Label>
            <Input
              id="name"
              type="text"
              value={customerData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Votre nom complet"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone *</Label>
            <Input
              id="phone"
              type="tel"
              value={customerData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+243123456789"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email (optionnel)</Label>
            <Input
              id="email"
              type="email"
              value={customerData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="votre@email.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Adresse de livraison *</Label>
            <Input
              id="address"
              type="text"
              value={customerData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Votre adresse complète"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes pour la commande</Label>
          <Textarea
            id="notes"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Ajoutez des notes pour votre commande..."
            className="min-h-[80px]"
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Sous-total:</span>
            <span>{formatPrice(subtotal)} FC</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Livraison:</span>
            <span>À déterminer</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium text-lg">
            <span>Total:</span>
            <span>{formatPrice(subtotal)} FC</span>
          </div>
        </div>

        <Button
          onClick={handleSubmitOrder}
          className="w-full bg-[#25D366] hover:bg-[#075E54] text-white"
          disabled={isSubmitting}
          size="lg"
        >
          <WhatsAppIcon className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Création de la commande...' : 'Finaliser la commande via WhatsApp'}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          * Champs obligatoires. Votre commande sera enregistrée et vous serez redirigé vers WhatsApp automatiquement.
        </p>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
