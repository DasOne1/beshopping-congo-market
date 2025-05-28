
import React, { useState } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingBag, Search, Filter, Eye, Edit, Trash2, Package, Truck, CheckCircle } from 'lucide-react';
import { useOrders, Order } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

export default function Orders() {
  const { user } = useAuth();
  const { orders, isLoading, updateOrderStatus, deleteOrder } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Chargement des commandes...</p>
        </div>
      </AdminLayout>
    );
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.order_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary' as const, icon: Package },
      confirmed: { label: 'Confirmé', variant: 'default' as const, icon: CheckCircle },
      processing: { label: 'En traitement', variant: 'secondary' as const, icon: Package },
      shipped: { label: 'Expédié', variant: 'outline' as const, icon: Truck },
      delivered: { label: 'Livré', variant: 'default' as const, icon: CheckCircle },
      cancelled: { label: 'Annulé', variant: 'destructive' as const, icon: Trash2 },
    };

    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus.mutate({ id: orderId, status: newStatus });
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      deleteOrder.mutate(orderId);
    }
  };

  const ordersByStatus = {
    all: filteredOrders,
    pending: filteredOrders.filter(o => o.status === 'pending'),
    confirmed: filteredOrders.filter(o => o.status === 'confirmed'),
    processing: filteredOrders.filter(o => o.status === 'processing'),
    shipped: filteredOrders.filter(o => o.status === 'shipped'),
    delivered: filteredOrders.filter(o => o.status === 'delivered'),
    cancelled: filteredOrders.filter(o => o.status === 'cancelled'),
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <ShoppingBag className="mr-2 h-6 w-6" />
              Gestion des Commandes
            </h1>
            <p className="text-muted-foreground">Gérer toutes les commandes clients</p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une commande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmé</SelectItem>
                <SelectItem value="processing">En traitement</SelectItem>
                <SelectItem value="shipped">Expédié</SelectItem>
                <SelectItem value="delivered">Livré</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">Toutes ({ordersByStatus.all.length})</TabsTrigger>
            <TabsTrigger value="pending">En attente ({ordersByStatus.pending.length})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmé ({ordersByStatus.confirmed.length})</TabsTrigger>
            <TabsTrigger value="processing">Traitement ({ordersByStatus.processing.length})</TabsTrigger>
            <TabsTrigger value="shipped">Expédié ({ordersByStatus.shipped.length})</TabsTrigger>
            <TabsTrigger value="delivered">Livré ({ordersByStatus.delivered.length})</TabsTrigger>
            <TabsTrigger value="cancelled">Annulé ({ordersByStatus.cancelled.length})</TabsTrigger>
          </TabsList>

          {Object.entries(ordersByStatus).map(([status, orderList]) => (
            <TabsContent key={status} value={status}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {status === 'all' ? 'Toutes les commandes' : 
                     status === 'pending' ? 'Commandes en attente' :
                     status === 'confirmed' ? 'Commandes confirmées' :
                     status === 'processing' ? 'Commandes en traitement' :
                     status === 'shipped' ? 'Commandes expédiées' :
                     status === 'delivered' ? 'Commandes livrées' :
                     'Commandes annulées'}
                  </CardTitle>
                  <CardDescription>
                    {orderList.length} commande{orderList.length > 1 ? 's' : ''}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orderList.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <ShoppingBag className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p>Aucune commande trouvée</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orderList.map((order) => (
                        <div 
                          key={order.id}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg bg-background border hover:shadow-md transition-shadow"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="font-medium text-lg">{order.customer_name}</div>
                              {getStatusBadge(order.status)}
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>Commande: <span className="font-mono">{order.order_number}</span></div>
                              <div>Date: {new Date(order.created_at!).toLocaleDateString('fr-FR')}</div>
                              <div>Total: <span className="font-semibold">{formatCurrency(order.total_amount)}</span></div>
                              {order.customer_phone && (
                                <div>Téléphone: {order.customer_phone}</div>
                              )}
                              {order.whatsapp_number && (
                                <div>WhatsApp: {order.whatsapp_number}</div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-3 sm:mt-0">
                            <Select 
                              value={order.status} 
                              onValueChange={(newStatus) => handleStatusUpdate(order.id, newStatus as Order['status'])}
                            >
                              <SelectTrigger className="w-36">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">En attente</SelectItem>
                                <SelectItem value="confirmed">Confirmé</SelectItem>
                                <SelectItem value="processing">En traitement</SelectItem>
                                <SelectItem value="shipped">Expédié</SelectItem>
                                <SelectItem value="delivered">Livré</SelectItem>
                                <SelectItem value="cancelled">Annulé</SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Détails de la commande sélectionnée */}
        {selectedOrder && (
          <Card>
            <CardHeader>
              <CardTitle>Détails de la commande {selectedOrder.order_number}</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedOrder(null)}
                className="w-fit"
              >
                Fermer
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Informations client</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Nom:</strong> {selectedOrder.customer_name}</div>
                    {selectedOrder.customer_email && (
                      <div><strong>Email:</strong> {selectedOrder.customer_email}</div>
                    )}
                    {selectedOrder.customer_phone && (
                      <div><strong>Téléphone:</strong> {selectedOrder.customer_phone}</div>
                    )}
                    {selectedOrder.whatsapp_number && (
                      <div><strong>WhatsApp:</strong> {selectedOrder.whatsapp_number}</div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Détails de la commande</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Statut:</strong> {getStatusBadge(selectedOrder.status)}</div>
                    <div><strong>Date:</strong> {new Date(selectedOrder.created_at!).toLocaleString('fr-FR')}</div>
                    <div><strong>Sous-total:</strong> {formatCurrency(selectedOrder.subtotal)}</div>
                    {selectedOrder.tax_amount > 0 && (
                      <div><strong>Taxes:</strong> {formatCurrency(selectedOrder.tax_amount)}</div>
                    )}
                    {selectedOrder.shipping_amount > 0 && (
                      <div><strong>Livraison:</strong> {formatCurrency(selectedOrder.shipping_amount)}</div>
                    )}
                    {selectedOrder.discount_amount > 0 && (
                      <div><strong>Remise:</strong> -{formatCurrency(selectedOrder.discount_amount)}</div>
                    )}
                    <div className="pt-2 border-t"><strong>Total:</strong> <span className="text-lg">{formatCurrency(selectedOrder.total_amount)}</span></div>
                  </div>
                </div>
              </div>
              
              {selectedOrder.shipping_address && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Adresse de livraison</h3>
                  <div className="text-sm">
                    {JSON.stringify(selectedOrder.shipping_address, null, 2)}
                  </div>
                </div>
              )}
              
              {selectedOrder.notes && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Notes</h3>
                  <p className="text-sm bg-muted p-3 rounded">{selectedOrder.notes}</p>
                </div>
              )}
              
              {selectedOrder.order_items && selectedOrder.order_items.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Articles commandés</h3>
                  <div className="space-y-3">
                    {selectedOrder.order_items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 border rounded">
                        {item.product_image && (
                          <img 
                            src={item.product_image} 
                            alt={item.product_name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <div className="font-medium">{item.product_name}</div>
                          <div className="text-sm text-muted-foreground">
                            Quantité: {item.quantity} × {formatCurrency(item.unit_price)}
                          </div>
                        </div>
                        <div className="font-semibold">{formatCurrency(item.total_price)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
