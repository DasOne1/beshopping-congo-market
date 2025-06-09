
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { User, Phone, Mail, MapPin, ShoppingBag, Calendar } from 'lucide-react';

interface CustomerDetailDialogProps {
  customer?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CustomerDetailDialog = ({ customer, open, onOpenChange }: CustomerDetailDialogProps) => {
  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {customer.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations personnelles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Nom complet</p>
                      <p className="font-medium">{customer.name}</p>
                    </div>
                  </div>
                  
                  {customer.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{customer.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {customer.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="font-medium">{customer.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {customer.address?.address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Adresse</p>
                        <p className="font-medium">{customer.address.address}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Membre depuis</p>
                      <p className="font-medium">{formatDate(customer.created_at)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                      {customer.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-2xl font-bold">{customer.orders_count || 0}</p>
                    <p className="text-sm text-gray-500">Commandes</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(customer.total_spent || 0)}
                    </div>
                    <p className="text-sm text-gray-500">Total dépensé</p>
                  </div>
                </div>
                
                {customer.last_order_date && (
                  <div>
                    <p className="text-sm text-gray-500">Dernière commande</p>
                    <p className="font-medium">{formatDate(customer.last_order_date)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historique des commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Aucune commande trouvée</p>
                <p className="text-sm">L'historique des commandes sera affiché ici</p>
              </div>
            </CardContent>
          </Card>
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

export default CustomerDetailDialog;
