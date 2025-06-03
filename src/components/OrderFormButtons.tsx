
import React from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

interface OrderFormButtonsProps {
  isSubmitting: boolean;
  isFormValid: boolean;
  whatsappMessage: string;
  onWhatsAppOrder: () => void;
}

const OrderFormButtons: React.FC<OrderFormButtonsProps> = ({
  isSubmitting,
  isFormValid,
  whatsappMessage,
  onWhatsAppOrder
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed" 
        size="lg"
        disabled={isSubmitting || !isFormValid}
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

      <Button
        type="button"
        onClick={onWhatsAppOrder}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
        size="lg"
      >
        <WhatsAppIcon className="mr-2 h-4 w-4" />
        Commander via WhatsApp
      </Button>
    </div>
  );
};

export default OrderFormButtons;
