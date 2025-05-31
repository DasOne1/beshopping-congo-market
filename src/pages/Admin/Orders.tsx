
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrders } from '@/hooks/useOrders';
import OrderSkeleton from '@/components/OrderSkeleton';
import { Loader2, Search, Package, Truck, CheckCircle, XCircle, Calendar, DollarSign, User, Phone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import AdminLayout from '@/components/Admin/AdminLayout';

const Orders = () => {
  const { orders, isLoading, updateOrderStatus } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.order_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Calendar className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({ id: orderId, status: newStatus as any });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Commandes</h1>
              <p className="text-muted-foreground">Gérez toutes les commandes de votre boutique</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-10 w-full md:w-[200px] bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="grid gap-4">
            <OrderSkeleton count={5} />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Commandes</h1>
            <p className="text-muted-foreground">Gérez toutes les commandes de votre boutique</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par numéro de commande ou nom client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
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

        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <CardTitle className="text-lg">{order.order_number || 'N/A'}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {order.customer_name || 'Client inconnu'}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status || 'pending')}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status || 'pending')}
                        {order.status || 'pending'}
                      </div>
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">{order.total_amount.toLocaleString()} CDF</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(order.created_at!), { addSuffix: true, locale: fr })}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{order.customer_phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Paiement: {order.payment_status || 'pending'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{order.order_items?.length || 0} article(s)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  >
                    {selectedOrder?.id === order.id ? 'Masquer les détails' : 'Voir les détails'}
                  </Button>
                  
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                        disabled={updateOrderStatus.isPending}
                      >
                        Confirmer
                      </Button>
                    )}
                    {order.status === 'confirmed' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'processing')}
                        disabled={updateOrderStatus.isPending}
                      >
                        Traiter
                      </Button>
                    )}
                    {order.status === 'processing' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'shipped')}
                        disabled={updateOrderStatus.isPending}
                      >
                        Expédier
                      </Button>
                    )}
                    {order.status === 'shipped' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, 'delivered')}
                        disabled={updateOrderStatus.isPending}
                      >
                        Livrer
                      </Button>
                    )}
                  </div>
                </div>

                {selectedOrder?.id === order.id && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold mb-2">Articles commandés :</h4>
                    <div className="space-y-2">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{item.product_name}</span>
                            <span className="text-sm text-muted-foreground ml-2">x{item.quantity}</span>
                          </div>
                          <span className="font-semibold">{item.total_price.toLocaleString()} CDF</span>
                        </div>
                      ))}
                    </div>
                    
                    {order.shipping_address && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Adresse de livraison :</h4>
                        <div className="p-2 bg-gray-50 rounded text-sm">
                          {typeof order.shipping_address === 'object' ? (
                            <div>
                              <div>{order.shipping_address.street}</div>
                              <div>{order.shipping_address.city}</div>
                              {order.shipping_address.commune && <div>{order.shipping_address.commune}</div>}
                            </div>
                          ) : (
                            order.shipping_address
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune commande trouvée</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche.'
                  : 'Les nouvelles commandes apparaîtront ici.'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Orders;
