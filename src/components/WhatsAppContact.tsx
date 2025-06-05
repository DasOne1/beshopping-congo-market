import React from 'react';
import { Button } from '@/components/ui/button';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { useNavigate } from 'react-router-dom';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

interface WhatsAppContactProps {
  phoneNumber: string;
  message: string;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  onCustomClick?: () => void;
}

const WhatsAppContact: React.FC<WhatsAppContactProps> = ({
  phoneNumber,
  message,
  className = '',
  size = 'default',
  children,
  onCustomClick
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useCustomerAuth();

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate('/customer-auth', { state: { from: window.location.pathname } });
      return;
    }

    if (onCustomClick) {
      onCustomClick();
    } else {
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <Button
      onClick={handleClick}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
      size={size}
    >
      {children || (
        <>
          <WhatsAppIcon className="mr-2 h-4 w-4" />
          Envoyer via WhatsApp
        </>
      )}
    </Button>
  );
};

export default WhatsAppContact;
