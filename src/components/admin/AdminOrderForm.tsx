
import React from 'react';
import { Button } from '@/components/ui/button';

interface AdminOrderFormProps {
  order?: any;
  onClose: () => void;
}

export const AdminOrderForm: React.FC<AdminOrderFormProps> = ({ order, onClose }) => {
  return (
    <div className="space-y-4">
      <p>Formulaire de commande - À implémenter selon les besoins spécifiques</p>
      <Button onClick={onClose}>Fermer</Button>
    </div>
  );
};
