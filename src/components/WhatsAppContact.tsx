import React from 'react';
import { Button } from '@/components/ui/button';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { useWhatsApp } from '@/hooks/useWhatsApp';
import WhatsAppConfirmationDialog from './WhatsAppConfirmationDialog';

interface WhatsAppContactProps {
  phoneNumber?: string; // Optionnel maintenant, sera remplacé par le numéro fixe
  message: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  children?: React.ReactNode;
  onCustomClick?: () => void;
  orderDetails?: {
    customerName?: string;
    customerPhone?: string;
    customerAddress?: string;
    productName?: string;
    description?: string;
    budget?: string;
  };
}

const WhatsAppContact: React.FC<WhatsAppContactProps> = ({
  phoneNumber,
  message,
  className = '',
  size = 'default',
  variant = 'default',
  children,
  onCustomClick,
  orderDetails
}) => {
  const {
    showConfirmation,
    orderDetails: hookOrderDetails,
    sendWhatsAppMessage,
    closeConfirmation
  } = useWhatsApp();

  const handleClick = () => {
    if (onCustomClick) {
      onCustomClick();
    } else {
      sendWhatsAppMessage(message, orderDetails);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
        size={size}
        variant={variant}
      >
        {children || (
          <>
            <WhatsAppIcon className="mr-2 h-4 w-4" />
            Commander via WhatsApp
          </>
        )}
      </Button>

      <WhatsAppConfirmationDialog
        open={showConfirmation}
        onOpenChange={() => closeConfirmation()}
        orderDetails={hookOrderDetails}
        message={message}
        onClose={closeConfirmation}
      />
    </>
  );
};

export default WhatsAppContact;
