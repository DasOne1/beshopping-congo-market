
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';

export interface WhatsAppContactProps {
  phoneNumber: string;
  message: string;
  children: React.ReactNode;
  className?: string;
  onCustomClick?: () => void;
}

const WhatsAppContact = ({ 
  phoneNumber, 
  message, 
  children, 
  className = '',
  onCustomClick
}: WhatsAppContactProps) => {
  const handleClick = () => {
    if (onCustomClick) {
      onCustomClick();
      return;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  return (
    <Button 
      onClick={handleClick}
      className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
    >
      <WhatsAppIcon className="w-4 h-4 mr-2" />
      {children}
    </Button>
  );
};

export default WhatsAppContact;
