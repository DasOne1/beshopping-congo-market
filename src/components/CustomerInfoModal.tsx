
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Phone, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}

interface CustomerInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (customerInfo: CustomerInfo) => void;
  onWhatsAppSubmit?: (customerInfo: CustomerInfo) => void;
  title?: string;
  description?: string;
  isSubmitting?: boolean;
}

const CustomerInfoModal: React.FC<CustomerInfoModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
  onWhatsAppSubmit,
  title = "Informations de livraison",
  description = "Veuillez remplir vos informations pour finaliser votre commande",
  isSubmitting = false
}) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent, isWhatsApp = false) => {
    e.preventDefault();
    
    // Validation
    if (!customerInfo.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom est requis",
        variant: "destructive",
      });
      return;
    }
    
    if (!customerInfo.phone.trim()) {
      toast({
        title: "Erreur",
        description: "Le numéro de téléphone est requis",
        variant: "destructive",
      });
      return;
    }
    
    if (!customerInfo.address.trim()) {
      toast({
        title: "Erreur",
        description: "L'adresse est requise",
        variant: "destructive",
      });
      return;
    }

    if (isWhatsApp && onWhatsAppSubmit) {
      onWhatsAppSubmit(customerInfo);
    } else {
      onSubmit(customerInfo);
    }
  };

  const handleClose = () => {
    setCustomerInfo({ name: '', phone: '', address: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <p className="text-sm text-muted-foreground text-center">{description}</p>
        </DialogHeader>
        
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Nom complet *
            </Label>
            <Input
              id="customer-name"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              placeholder="Votre nom complet"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customer-phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Téléphone *
            </Label>
            <Input
              id="customer-phone"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              placeholder="Votre numéro de téléphone"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customer-address" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Adresse de livraison *
            </Label>
            <Textarea
              id="customer-address"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
              placeholder="Votre adresse complète de livraison"
              required
              rows={3}
            />
          </div>
          
          <div className="flex flex-col gap-2 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Commande en cours...' : 'Passer la commande'}
            </Button>
            
            {onWhatsAppSubmit && (
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleSubmit(e, true)}
                disabled={isSubmitting}
                className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
              >
                Commander via WhatsApp
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerInfoModal;
