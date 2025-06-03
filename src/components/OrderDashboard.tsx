import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Package, Calendar, DollarSign, ShoppingBag, ShoppingCart, Heart, X } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at?: string;
  order_items?: Array<{
    id: string;
    product_name: string;
    product_image?: string;
    quantity: number;
    unit_price: number;
  }>;
}

interface OrderDashboardProps {
  orders: Order[];
  isLoading: boolean;
  cartCount?: number;
  favoritesCount?: number;
}

const OrderDashboard = ({ orders, isLoading, cartCount = 0, favoritesCount = 0 }: OrderDashboardProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Statistiques
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const processingOrders = orders.filter(order => order.status === 'processing').length;

    return {
      totalOrders,
      totalAmount,
      pendingOrders,
      processingOrders
    };
  }, [orders]);

  // Filtrage des commandes
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = searchQuery === '' || (
        (order.order_number?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (order.customer_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      );

      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

      const orderDate = order.created_at ? new Date(order.created_at) : new Date();
      const now = new Date();
      const matchesDate = dateFilter === 'all' ? true :
        dateFilter === 'today' ? orderDate.toDateString() === now.toDateString() :
        dateFilter === 'week' ? (now.getTime() - orderDate.getTime()) <= 7 * 24 * 60 * 60 * 1000 :
        dateFilter === 'month' ? orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear() :
        false;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchQuery, statusFilter, dateFilter]);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Date non disponible';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    if (!price) return '0';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  if (isLoading) {
    return (
      <div className="text-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground mt-4">Chargement des commandes...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-6">
        <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          Aucune commande trouvée
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total des commandes</p>
                <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
              </div>
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Montant total</p>
                <h3 className="text-2xl font-bold">{formatPrice(stats.totalAmount)} FC</h3>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En attente</p>
                <h3 className="text-2xl font-bold">{stats.pendingOrders}</h3>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">En cours</p>
                <h3 className="text-2xl font-bold">{stats.processingOrders}</h3>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => window.location.href = '/cart'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Articles en panier</p>
                <h3 className="text-2xl font-bold">{cartCount}</h3>
              </div>
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-accent/50 transition-colors" onClick={() => window.location.href = '/favorites'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Articles likés</p>
                <h3 className="text-2xl font-bold">{favoritesCount}</h3>
              </div>
              <Heart className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card className="sticky top-0 z-10 bg-background border-b">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une commande..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="processing">En cours</SelectItem>
                  <SelectItem value="delivered">Terminée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des commandes */}
      <div className="relative">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-background z-10">
              <tr className="border-b">
                <th className="text-left p-4 font-medium">Articles</th>
                <th className="text-right p-4 font-medium">Montant</th>
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border-b hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {order.order_items && order.order_items.length > 0 && (
                          <>
                            <div className="relative">
                              <img 
                                src={order.order_items[0].product_image} 
                                alt={order.order_items[0].product_name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              {order.order_items.length > 1 && (
                                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  +{order.order_items.length - 1}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{order.order_items[0].product_name}</div>
                              <div className="text-sm text-muted-foreground">
                                {order.order_items.length} article(s)
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="font-medium">{formatPrice(order.total_amount)} FC</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">{formatDate(order.created_at)}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant={
                        order.status === 'delivered' ? 'default' :
                        order.status === 'processing' ? 'secondary' :
                        order.status === 'cancelled' ? 'destructive' :
                        'outline'
                      }>
                        {order.status === 'delivered' ? 'Terminée' :
                         order.status === 'processing' ? 'En cours' :
                         order.status === 'cancelled' ? 'Annulée' :
                         'En attente'}
                      </Badge>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Aucune commande trouvée
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de détails de la commande */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Détails de la commande #{selectedOrder?.order_number}</span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Informations de la commande */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-medium">{formatDate(selectedOrder?.created_at)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Statut</p>
                <Badge variant={
                  selectedOrder?.status === 'delivered' ? 'default' :
                  selectedOrder?.status === 'processing' ? 'secondary' :
                  selectedOrder?.status === 'cancelled' ? 'destructive' :
                  'outline'
                }>
                  {selectedOrder?.status === 'delivered' ? 'Terminée' :
                   selectedOrder?.status === 'processing' ? 'En cours' :
                   selectedOrder?.status === 'cancelled' ? 'Annulée' :
                   'En attente'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-medium">{formatPrice(selectedOrder?.total_amount || 0)} FC</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Articles</p>
                <p className="font-medium">{selectedOrder?.order_items?.length || 0} article(s)</p>
              </div>
            </div>

            {/* Liste des articles */}
            <div className="space-y-4">
              <h3 className="font-medium">Articles commandés</h3>
              <div className="space-y-4">
                {selectedOrder?.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-accent/50 rounded-lg">
                    {item.product_image && (
                      <img 
                        src={item.product_image} 
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x {formatPrice(item.unit_price)} FC
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.quantity * item.unit_price)} FC</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderDashboard; 