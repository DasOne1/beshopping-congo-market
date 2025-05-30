
import React from 'react';
import { CheckCircle, Package, Clock, MessageCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import WhatsAppContact from './WhatsAppContact';

interface OrderConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderDetails?: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    total?: string;
    orderType: 'form' | 'whatsapp';
  };
}

const OrderConfirmationDialog: React.FC<OrderConfirmationDialogProps> = ({
  isOpen,
  onClose,
  orderDetails
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="flex justify-center mb-4"
          >
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </motion.div>
          
          <DialogTitle className="text-center text-xl font-bold text-foreground">
            Commande Confirmée !
          </DialogTitle>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="text-center text-muted-foreground">
            {orderDetails?.orderType === 'whatsapp' ? (
              <p>Votre commande a été envoyée via WhatsApp. Notre équipe vous contactera bientôt pour confirmer les détails.</p>
            ) : (
              <p>Merci pour votre commande ! Nous avons bien reçu vos informations et nous vous contactons bientôt.</p>
            )}
          </div>

          {orderDetails && (
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-foreground">Récapitulatif :</h4>
              <div className="text-sm space-y-1">
                <p><span className="font-medium">Nom :</span> {orderDetails.customerName}</p>
                <p><span className="font-medium">Téléphone :</span> {orderDetails.customerPhone}</p>
                <p><span className="font-medium">Adresse :</span> {orderDetails.customerAddress}</p>
                {orderDetails.total && (
                  <p><span className="font-medium">Total :</span> {orderDetails.total} FC</p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 py-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full mx-auto mb-2 w-fit">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs text-muted-foreground">Préparation</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-full mx-auto mb-2 w-fit">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-xs text-muted-foreground">Livraison</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full mx-auto mb-2 w-fit">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs text-muted-foreground">Réception</p>
            </motion.div>
          </div>

          <div className="space-y-3">
            <WhatsAppContact
              phoneNumber="243978100940"
              message="Bonjour! Je viens de passer une commande et j'aimerais avoir plus d'informations."
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contacter via WhatsApp
            </WhatsAppContact>
            
            <Button onClick={onClose} variant="outline" className="w-full">
              Fermer
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderConfirmationDialog;
