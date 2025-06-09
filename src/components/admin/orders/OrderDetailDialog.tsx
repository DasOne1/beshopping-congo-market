
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { Package, User, MapPin, Phone, Mail, Calendar, CreditCard } from 'lucide-react';

interface OrderDetailDialogProps {
  order?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetailDialog = ({ order, open, onOpenChange }: OrderDetailDialogProps) => {
  if (!order) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'En attente' },
      confirmed: { variant: 'default' as const, label: 'Confirmée' },
      processing: { variant: 'default' as const, label: 'En cours' },
      shipped: { variant: 'default' as const, label: 'Expédiée' },
      delivered: { variant: 'default' as const, label: 'Livrée' },
      cancelled: { variant: 'destructive' as const, label: 'Annulée' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Commande #{order.order_number}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Statut:</span>
              {getStatusBadge(order.status)}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{formatCurrency(order.total_amount)}</p>
              <p className="text-sm text-gray-500">{formatDateTime(order.created_at)}</p>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informations client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nom</p>
                  <p className="font-medium">{order.customer_name}</p>
                </div>
                
                {order.customer_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{order.customer_email}</span>
                  </div>
                )}
                
                {order.customer_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{order.customer_phone}</span>
                  </div>
                )}
                
                {order.whatsapp_number && (
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    <p className="text-sm">{order.whatsapp_number}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Adresse de livraison
                </CardTitle>
              </CardHeader>
              <CardContent>
                {order.shipping_address ? (
                  <div className="space-y-2">
                    {typeof order.shipping_address === 'string' ? (
                      <p>{order.shipping_address}</p>
                    ) : (
                      <div>
                        <p>{order.shipping_address.street}</p>
                        <p>{order.shipping_address.city}</p>
                        <p>{order.shipping_address.country}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucune adresse renseignée</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Articles commandés</CardTitle>
            </CardHeader>
            <CardContent>
              {order.order_items && order.order_items.length > 0 ? (
                <div className="space-y-4">
                  {order.order_items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                      {item.product_image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img 
                            src={item.product_image} 
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.product_name}</h4>
                        <p className="text-sm text-gray-500">
                          Quantité: {item.quantity} • Prix unitaire: {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.total_price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">Aucun article dans cette commande</p>
              )}
            </CardContent>
          </Card>

          {/* Payment & Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Paiement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Méthode de paiement</p>
                  <p className="font-medium">{order.payment_method || 'Non spécifiée'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Statut du paiement</p>
                  <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                    {order.payment_status === 'paid' ? 'Payé' : 'En attente'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Résumé</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                
                {order.tax_amount > 0 && (
                  <div className="flex justify-between">
                    <span>Taxes</span>
                    <span>{formatCurrency(order.tax_amount)}</span>
                  </div>
                )}
                
                {order.shipping_amount > 0 && (
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>{formatCurrency(order.shipping_amount)}</span>
                  </div>
                )}
                
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Remise</span>
                    <span>-{formatCurrency(order.discount_amount)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
