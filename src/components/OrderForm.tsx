
import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import WhatsAppContact from '@/components/WhatsAppContact';

interface OrderFormProps {
  onOrderComplete?: () => void;
  cartProducts?: any[];
  subtotal?: number;
  formatPrice?: (price: number) => string;
}

const OrderForm = ({ onOrderComplete, cartProducts, subtotal, formatPrice }: OrderFormProps) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!customerName || !customerPhone || !customerAddress) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    toast({
      title: "Commande enregistrée!",
      description: "Votre commande a été enregistrée avec succès.",
    });

    if (onOrderComplete) {
      onOrderComplete();
    }
  };

  const generateWhatsAppMessage = () => {
    let message = `Bonjour, je souhaite passer une commande avec les informations suivantes:\n\nNom: ${customerName}\nTéléphone: ${customerPhone}\nAdresse: ${customerAddress}`;
    
    if (cartProducts && cartProducts.length > 0) {
      message += '\n\nProduits commandés:';
      cartProducts.forEach(item => {
        if (item.product) {
          const price = item.product.discounted_price || item.product.original_price;
          const itemTotal = formatPrice ? formatPrice(price * item.quantity) : (price * item.quantity);
          message += `\n- ${item.product.name} x${item.quantity} = ${itemTotal} FC`;
        }
      });
      
      if (subtotal && formatPrice) {
        message += `\n\nTotal: ${formatPrice(subtotal)} FC`;
      }
    }
    
    return message;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Informations de livraison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              placeholder="Votre nom complet"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input
              id="phone"
              placeholder="Votre numéro de téléphone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="address">Adresse de livraison</Label>
            <Input
              id="address"
              placeholder="Votre adresse de livraison"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
            size="lg"
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Passer la commande
              </>
            )}
          </Button>

          <div className="text-center text-sm text-gray-500">ou</div>

          <WhatsAppContact
            phoneNumber="243978100940"
            message={generateWhatsAppMessage()}
            className="w-full bg-whatsapp hover:bg-whatsapp-dark text-white"
            size="lg"
          >
            Commander via WhatsApp
          </WhatsAppContact>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderForm;
