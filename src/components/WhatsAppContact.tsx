
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface WhatsAppContactProps {
  phoneNumber?: string;
  message?: string;
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  useAlternate?: boolean;
}

const WhatsAppContact: React.FC<WhatsAppContactProps> = ({
  phoneNumber,
  message = "Bonjour, j'aimerais avoir plus d'informations.",
  children,
  className = "",
  size = "default",
  variant = "default",
  useAlternate = false
}) => {
  // Utiliser le WhatsApp officiel par défaut, et le business en alternative
  const defaultPhoneNumber = useAlternate ? "243123456789" : "243978100940";
  const finalPhoneNumber = phoneNumber || defaultPhoneNumber;

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${finalPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className={`${className} flex items-center gap-2`}
      size={size}
      variant={variant}
    >
      <MessageCircle className="w-4 h-4" />
      {children}
    </Button>
  );
};

export default WhatsAppContact;
