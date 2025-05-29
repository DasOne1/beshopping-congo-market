
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface WhatsAppContactProps {
  phoneNumber: string;
  message?: string;
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
}

const WhatsAppContact: React.FC<WhatsAppContactProps> = ({
  phoneNumber,
  message = "Bonjour, j'aimerais avoir plus d'informations.",
  children,
  className = "",
  size = "default"
}) => {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className={`${className} flex items-center gap-2`}
      size={size}
    >
      <MessageCircle className="w-4 h-4" />
      {children}
    </Button>
  );
};

export default WhatsAppContact;
