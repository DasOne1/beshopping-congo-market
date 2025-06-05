
import React from 'react';
import { Button } from '@/components/ui/button';
import WhatsAppContact from '@/components/WhatsAppContact';
import { MessageCircle, ShoppingCart } from 'lucide-react';

export interface OrderFormButtonsProps {
  isSubmitting: boolean;
  isFormValid: boolean;
  whatsappMessage: string;
  onWhatsAppOrder: () => Promise<void>;
  isAuthenticated: boolean;
}

const OrderFormButtons = ({
  isSubmitting,
  isFormValid,
  whatsappMessage,
  onWhatsAppOrder,
  isAuthenticated
}: OrderFormButtonsProps) => {
  return (
    <div className="space-y-4">
      <Button
        type="submit"
        className="w-full"
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Traitement en cours...
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            Passer la commande
          </>
        )}
      </Button>

      <div className="text-center text-sm text-muted-foreground mb-4">
        ou
      </div>

      <WhatsAppContact
        phoneNumber="243970284772"
        message={whatsappMessage}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        <MessageCircle className="mr-2 h-4 w-4" />
        Commander via WhatsApp
      </WhatsAppContact>
    </div>
  );
};

export default OrderFormButtons;
