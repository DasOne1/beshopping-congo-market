
import React from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WhatsAppContact from '@/components/WhatsAppContact';

interface OrderFormButtonsProps {
  isSubmitting: boolean;
  whatsappMessage: string;
  onWhatsAppOrder: () => void;
}

const OrderFormButtons: React.FC<OrderFormButtonsProps> = ({
  isSubmitting,
  whatsappMessage,
  onWhatsAppOrder
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
        size="lg"
        disabled={isSubmitting}
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
        message={whatsappMessage}
        className="w-full bg-whatsapp hover:bg-whatsapp-dark text-white"
        size="lg"
        children="Commander via WhatsApp"
        onCustomClick={onWhatsAppOrder}
      />
    </div>
  );
};

export default OrderFormButtons;
