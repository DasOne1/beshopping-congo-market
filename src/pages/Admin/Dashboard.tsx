
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, ShoppingBag, Package, AlertCircle, DollarSign } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { useDashboard } from '@/hooks/useDashboard';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const { stats, isLoading } = useDashboard();
  const { recentOrders } = useOrders();

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Veuillez vous connecter pour accéder au tableau de bord.</p>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Chargement du tableau de bord...</p>
        </div>
      </AdminLayout>
    );
  }

  // Couleurs pour le graphique circulaire
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Formater les nombres
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary' as const },
      confirmed: { label: 'Confirmé', variant: 'default' as const },
      processing: { label: 'En traitement', variant: 'secondary' as const },
      shipped: { label: 'Expédié', variant: 'outline' as const },
      delivered: { label: 'Livré', variant: 'default' as const },
      cancelled: { label: 'Annulé', variant: 'destructive' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, variant: 'secondary' as const };
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord</h1>
          <p className="text-muted-foreground">
            Aperçu de votre activité commerciale
          </p>
        </div>

        {/* Cartes de statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.totalOrders)}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingOrders} en attente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                Commandes livrées uniquement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(stats.totalCustomers)}</div>
              <p className="text-xs text-muted-foreground">
                Clients enregistrés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{formatNumber(stats.pendingOrders)}</div>
              <p className="text-xs text-muted-foreground">
                Nécessitent votre attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenus mensuels */}
          <Card>
            <CardHeader>
              <CardTitle>Revenus par Mois</CardTitle>
              <CardDescription>Évolution des revenus sur les 6 derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), 'Revenus']}
                  />
                  <Bar dataKey="revenue" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Commandes par statut */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Commandes</CardTitle>
              <CardDescription>Commandes par statut</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.ordersByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, count }) => `${status}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {stats.ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Produits populaires et commandes récentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Produits les plus vendus */}
          <Card>
            <CardHeader>
              <CardTitle>Produits Populaires</CardTitle>
              <CardDescription>Produits les plus vendus</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Package className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{product.name}</span>
                    </div>
                    <Badge variant="secondary">
                      {product.sales} ventes
                    </Badge>
                  </div>
                ))}
                {stats.topProducts.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Aucune vente enregistrée
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Commandes récentes */}
          <Card>
            <CardHeader>
              <CardTitle>Commandes Récentes</CardTitle>
              <CardDescription>Dernières commandes reçues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{order.customer_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.order_number} • {formatCurrency(order.total_amount)}
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(order.created_at!).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Aucune commande récente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
