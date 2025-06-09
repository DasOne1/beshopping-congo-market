/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, Download, Eye, Edit, Trash2, Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import OrderDetailDialog from '@/components/admin/orders/OrderDetailDialog';

const AdminOrders = () => {
  const { orders, isLoading, updateOrderStatus, deleteOrder } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  const stats = {
    total: orders?.length || 0,
    pending: orders?.filter(o => o.status === 'pending').length || 0,
    processing: orders?.filter(o => o.status === 'confirmed' || o.status === 'processing' || o.status === 'shipped').length || 0,
    completed: orders?.filter(o => o.status === 'delivered').length || 0,
    customers: new Set(orders?.map(o => o.customer_id).filter(Boolean)).size || 0
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'En attente', icon: Clock },
      confirmed: { variant: 'default' as const, label: 'Confirmée', icon: CheckCircle },
      processing: { variant: 'default' as const, label: 'En cours', icon: Package },
      shipped: { variant: 'default' as const, label: 'Expédiée', icon: Package },
      delivered: { variant: 'default' as const, label: 'Livrée', icon: CheckCircle },
      cancelled: { variant: 'destructive' as const, label: 'Annulée', icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    await updateOrderStatus.mutateAsync({ id: orderId, status: newStatus as any });
  };

  const handleDelete = async (orderId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      await deleteOrder.mutateAsync(orderId);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Commandes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez toutes les commandes de votre boutique
          </p>
        </div>
        
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-orange-600">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">En cours</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-blue-600">{stats.processing}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Terminées</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        
        <Card className="col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Clients</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{stats.customers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par numéro, client ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="confirmed">Confirmées</SelectItem>
            <SelectItem value="processing">En cours</SelectItem>
            <SelectItem value="shipped">Expédiées</SelectItem>
            <SelectItem value="delivered">Livrées</SelectItem>
            <SelectItem value="cancelled">Annulées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px] md:min-w-[120px]">Commande</TableHead>
                  <TableHead className="min-w-[120px] md:min-w-[150px]">Client</TableHead>
                  <TableHead className="min-w-[80px] md:min-w-[120px]">Date</TableHead>
                  <TableHead className="min-w-[80px] md:min-w-[100px]">Montant</TableHead>
                  <TableHead className="min-w-[100px] md:min-w-[120px]">Statut</TableHead>
                  <TableHead className="text-right min-w-[150px] md:min-w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow 
                    key={order.id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsDetailDialogOpen(true);
                    }}
                  >
                    <TableCell className="min-w-[100px] md:min-w-[120px]">
                      <div>
                        <p className="font-medium text-sm md:text-base">{order.order_number}</p>
                        <p className="text-xs md:text-sm text-gray-500">
                          {order.order_items?.length || 0} article(s)
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[120px] md:min-w-[150px]">
                      <div>
                        <p className="font-medium text-sm md:text-base">{order.customer_name}</p>
                        <p className="text-xs md:text-sm text-gray-500">{order.customer_phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[80px] md:min-w-[120px] text-xs md:text-sm">{formatDateTime(order.created_at!)}</TableCell>
                    <TableCell className="font-medium min-w-[80px] md:min-w-[100px] text-sm md:text-base">
                      {formatCurrency(order.total_amount)}
                    </TableCell>
                    <TableCell className="min-w-[100px] md:min-w-[120px]">{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right min-w-[150px] md:min-w-[200px]">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                            setIsDetailDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Select onValueChange={(value) => handleStatusUpdate(order.id, value)}>
                          <SelectTrigger className="w-[100px] md:w-[130px]">
                            <SelectValue placeholder="Changer" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="confirmed">Confirmée</SelectItem>
                            <SelectItem value="processing">En cours</SelectItem>
                            <SelectItem value="shipped">Expédiée</SelectItem>
                            <SelectItem value="delivered">Livrée</SelectItem>
                            <SelectItem value="cancelled">Annulée</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(order.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        order={selectedOrder}
        open={isDetailDialogOpen}
        onOpenChange={(open) => {
          setIsDetailDialogOpen(open);
          if (!open) setSelectedOrder(null);
        }}
      />
    </div>
  );
};

export default AdminOrders;
