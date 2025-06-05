
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface WhatsAppContactProps {
  children: React.ReactNode;
  phoneNumber: string;
  message: string;
  className?: string;
  useAlternate?: boolean;
  onCustomClick?: () => void;
}

const WhatsAppContact = ({ 
  children, 
  phoneNumber, 
  message, 
  className = "",
  useAlternate = false,
  onCustomClick
}: WhatsAppContactProps) => {
  const handleWhatsAppClick = () => {
    if (onCustomClick) {
      onCustomClick();
    }
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <MessageCircle className="h-4 w-4" />
      {children}
    </Button>
  );
};

export default WhatsAppContact;
