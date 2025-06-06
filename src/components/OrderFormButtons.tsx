/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, ShoppingCart } from 'lucide-react';

interface OrderFormButtonsProps {
  isSubmitting: boolean;
  isFormValid: boolean;
  whatsappMessage: string;
  onWhatsAppOrder: () => Promise<void>;
  isAuthenticated: boolean;
  orderDetails: any;
  setShowConfirmation: (show: boolean) => void;
  handleSubmit: (data: any) => Promise<void>;
}

const OrderFormButtons: React.FC<OrderFormButtonsProps> = ({
  isSubmitting,
  isFormValid,
  whatsappMessage,
  onWhatsAppOrder,
  isAuthenticated,
  orderDetails,
  setShowConfirmation,
  handleSubmit
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={onWhatsAppOrder}
        disabled={!isFormValid || isSubmitting}
        className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Commander via WhatsApp
      </Button>
      
      {isAuthenticated && (
        <Button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="flex-1"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Commande en cours...' : 'Passer la commande'}
        </Button>
      )}
    </div>
  );
};

export default OrderFormButtons;
