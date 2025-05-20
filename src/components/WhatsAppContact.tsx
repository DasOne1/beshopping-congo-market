
import { Button } from '@/components/ui/button';
import { WhatsAppIcon } from './WhatsAppIcon';

interface WhatsAppContactProps {
  phoneNumber?: string;
  message?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
  useAlternate?: boolean;
}

const PRIMARY_WHATSAPP = "243978100940";
const SECONDARY_WHATSAPP = "243974984449";

const WhatsAppContact = ({
  phoneNumber,
  message = '',
  variant = 'default',
  size = 'default',
  className,
  children,
  useAlternate = false
}: WhatsAppContactProps) => {
  const whatsappNumber = phoneNumber || (useAlternate ? SECONDARY_WHATSAPP : PRIMARY_WHATSAPP);
  
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button 
      className={className}
      variant={variant} 
      size={size}
      onClick={handleWhatsAppClick}
    >
      <WhatsAppIcon className="mr-2 h-4 w-4" />
      {children || 'Contact via WhatsApp'}
    </Button>
  );
};

export default WhatsAppContact;
