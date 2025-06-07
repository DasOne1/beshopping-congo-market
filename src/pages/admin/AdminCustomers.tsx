
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Users,
  Phone,
  Mail,
  Eye,
  Edit,
  UserPlus,
  Package,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCustomers } from '@/hooks/useCustomers';
import { useOrders } from '@/hooks/useOrders';

const AdminCustomers = () => {
  const { customers, isLoading } = useCustomers();
  const { orders } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers?.filter((customer) => {
    return customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           customer.phone?.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  const getCustomerOrders = (customerId: string) => {
    return orders?.filter(order => order.customer_id === customerId) || [];
  };

  const getCustomerStats = (customerId: string) => {
    const customerOrders = getCustomerOrders(customerId);
    return {
      totalOrders: customerOrders.length,
      totalSpent: customerOrders.reduce((sum, order) => sum + order.total_amount, 0),
      lastOrderDate: customerOrders.length > 0 
        ? new Date(Math.max(...customerOrders.map(o => new Date(o.created_at!).getTime())))
        : null,
    };
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'Actif', variant: 'default' as const },
      inactive: { label: 'Inactif', variant: 'secondary' as const },
      blocked: { label: 'Bloqué', variant: 'destructive' as const },
    };
    
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const };
  };

  // Calculate overview stats
  const stats = {
    total: customers?.length || 0,
    active: customers?.filter(c => c.status === 'active').length || 0,
    totalRevenue: customers?.reduce((sum, customer) => sum + (customer.total_spent || 0), 0) || 0,
    avgOrderValue: customers && customers.length > 0
      ? customers.reduce((sum, customer) => sum + (customer.total_spent || 0), 0) / customers.length
      : 0,
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Clients</h1>
          <p className="text-muted-foreground">
            Gérez votre base de clients et analysez leur comportement
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Clients</p>
                <p className="text-lg font-semibold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Clients Actifs</p>
                <p className="text-lg font-semibold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Revenus Totaux</p>
                <p className="text-lg font-semibold">${stats.totalRevenue}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Panier Moyen</p>
                <p className="text-lg font-semibold">${stats.avgOrderValue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, email ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clients ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Commandes</TableHead>
                  <TableHead>Total Dépensé</TableHead>
                  <TableHead>Dernière Commande</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const stats = getCustomerStats(customer.id);
                  
                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Client depuis {new Date(customer.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {customer.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              {customer.email}
                            </div>
                          )}
                          {customer.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{stats.totalOrders}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">${stats.totalSpent}</p>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {stats.lastOrderDate 
                            ? stats.lastOrderDate.toLocaleDateString('fr-FR')
                            : 'Aucune commande'
                          }
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(customer.status || 'active').variant}>
                          {getStatusBadge(customer.status || 'active').label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              Voir
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Profil Client - {customer.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              {/* Customer Info */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-3">Informations personnelles</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><strong>Nom:</strong> {customer.name}</p>
                                    <p><strong>Email:</strong> {customer.email || 'N/A'}</p>
                                    <p><strong>Téléphone:</strong> {customer.phone || 'N/A'}</p>
                                    <p><strong>Statut:</strong> {getStatusBadge(customer.status || 'active').label}</p>
                                    <p><strong>Membre depuis:</strong> {new Date(customer.created_at).toLocaleDateString('fr-FR')}</p>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-3">Statistiques</h4>
                                  <div className="space-y-2 text-sm">
                                    <p><strong>Commandes totales:</strong> {stats.totalOrders}</p>
                                    <p><strong>Total dépensé:</strong> ${stats.totalSpent}</p>
                                    <p><strong>Panier moyen:</strong> ${stats.totalOrders > 0 ? (stats.totalSpent / stats.totalOrders).toFixed(2) : '0.00'}</p>
                                    <p><strong>Dernière commande:</strong> {stats.lastOrderDate ? stats.lastOrderDate.toLocaleDateString('fr-FR') : 'Aucune'}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Order History */}
                              <div>
                                <h4 className="font-medium mb-3">Historique des commandes</h4>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                  {getCustomerOrders(customer.id).map((order) => (
                                    <div key={order.id} className="flex justify-between items-center p-3 border rounded">
                                      <div>
                                        <p className="font-medium">{order.order_number}</p>
                                        <p className="text-sm text-muted-foreground">
                                          {new Date(order.created_at!).toLocaleDateString('fr-FR')}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <p className="font-medium">${order.total_amount}</p>
                                        <Badge variant={getStatusBadge(order.status || 'pending').variant} className="text-xs">
                                          {getStatusBadge(order.status || 'pending').label}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                  {getCustomerOrders(customer.id).length === 0 && (
                                    <p className="text-center text-muted-foreground py-4">
                                      Aucune commande pour ce client
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun client trouvé</h3>
              <p>
                {searchTerm
                  ? 'Aucun client ne correspond à votre recherche.'
                  : 'Aucun client enregistré pour le moment.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCustomers;
