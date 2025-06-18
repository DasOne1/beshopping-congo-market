import React from 'react';
import { CheckCircle, Phone, MessageCircle, ExternalLink, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface WhatsAppOrderDetails {
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  productName?: string;
  description?: string;
  budget?: string;
  orderType: 'whatsapp' | 'form';
}

interface WhatsAppConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderDetails?: WhatsAppOrderDetails | null;
  message?: string;
  onClose: () => void;
}

const WhatsAppConfirmationDialog: React.FC<WhatsAppConfirmationDialogProps> = ({
  open,
  onOpenChange,
  orderDetails,
  message,
  onClose
}) => {
  const isWhatsAppOrder = orderDetails?.orderType === 'whatsapp';
  
  const handleContactSupplier = () => {
    // Ouvrir WhatsApp pour contacter le fournisseur
    const contactMessage = encodeURIComponent("Bonjour, j'aimerais avoir plus d'informations sur ma commande.");
    const whatsappUrl = `https://wa.me/243978100940?text=${contactMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCallSupplier = () => {
    // Appeler le fournisseur
    window.open('tel:+243978100940', '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Commande Confirmée !
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {isWhatsAppOrder 
              ? "Votre commande a été envoyée avec succès via WhatsApp"
              : "Votre commande a été enregistrée avec succès"
            }
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informations de la commande */}
          {orderDetails && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Détails de la commande
              </h4>
              
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Client:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{orderDetails.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Contact:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{orderDetails.customerPhone}</span>
                </div>
                {orderDetails.customerAddress && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Adresse:</span>
                    <span className="font-medium text-gray-900 dark:text-white text-right max-w-[200px]">
                      {orderDetails.customerAddress}
                    </span>
                  </div>
                )}
                {orderDetails.productName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Produit:</span>
                    <span className="font-medium text-gray-900 dark:text-white text-right max-w-[200px]">
                      {orderDetails.productName}
                    </span>
                  </div>
                )}
                {orderDetails.description && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Description:</span>
                    <span className="font-medium text-gray-900 dark:text-white text-right max-w-[200px]">
                      {orderDetails.description.length > 50 
                        ? `${orderDetails.description.substring(0, 50)}...` 
                        : orderDetails.description
                      }
                    </span>
                  </div>
                )}
                {orderDetails.budget && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Montant:</span>
                    <Badge variant="secondary" className="font-medium">
                      {orderDetails.budget}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Message envoyé (version compacte) - seulement pour WhatsApp */}
          {message && isWhatsAppOrder && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-blue-600" />
                Message envoyé
              </h4>
              <div className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded p-3 border max-h-32 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-xs">
                  {message.length > 200 ? `${message.substring(0, 200)}...` : message}
                </pre>
              </div>
              {message.length > 200 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Message tronqué pour l'affichage
                </p>
              )}
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Souhaitez-vous entrer en contact avec notre équipe ?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={handleContactSupplier}
                className="bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              
              <Button
                onClick={handleCallSupplier}
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </Button>
            </div>

            <div className="text-center">
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                Fermer
              </Button>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-xs text-amber-800 dark:text-amber-200">
                <p className="font-medium mb-1">Prochaines étapes :</p>
                <ul className="space-y-1">
                  <li>• Notre équipe vous contactera dans les 24h</li>
                  <li>• Confirmation de disponibilité et délais</li>
                  <li>• Finalisation de la commande</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppConfirmationDialog; 