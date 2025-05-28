
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  DollarSign,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/Admin/AdminLayout';
import { useDashboard } from '@/hooks/useDashboard';
import { useAuth } from '@/hooks/useAuth';

const Dashboard = () => {
  const { dashboardData, isLoading } = useDashboard();
  const { signOut, user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleSignOut = async () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await signOut();
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Chargement du tableau de bord...</p>
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    {
      title: "Revenus totaux",
      value: formatCurrency(dashboardData?.totalRevenue || 0),
      change: dashboardData?.revenueGrowth || 0,
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Commandes",
      value: dashboardData?.totalOrders || 0,
      change: dashboardData?.ordersGrowth || 0,
      icon: ShoppingCart,
      color: "text-blue-600"
    },
    {
      title: "Produits",
      value: dashboardData?.totalProducts || 0,
      change: dashboardData?.productsGrowth || 0,
      icon: Package,
      color: "text-purple-600"
    },
    {
      title: "Clients",
      value: dashboardData?.totalCustomers || 0,
      change: dashboardData?.customersGrowth || 0,
      icon: Users,
      color: "text-orange-600"
    }
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header avec informations utilisateur */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">
              Bienvenue, {user?.email}
            </p>
          </div>
          
          <Button onClick={handleSignOut} variant="outline" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.change >= 0;
            
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {isPositive ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={isPositive ? "text-green-500" : "text-red-500"}>
                        {Math.abs(stat.change)}%
                      </span>
                      <span className="ml-1">par rapport au mois dernier</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Commandes récentes et produits populaires */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Commandes récentes</CardTitle>
              <CardDescription>
                Les {dashboardData?.recentOrders?.length || 0} dernières commandes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.recentOrders?.map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{order.customer_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.order_number}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(order.total_amount)}
                      </div>
                      <Badge 
                        variant={
                          order.status === 'delivered' ? 'default' :
                          order.status === 'pending' ? 'secondary' :
                          order.status === 'cancelled' ? 'destructive' : 'outline'
                        }
                        className="text-xs"
                      >
                        {order.status === 'pending' ? 'En attente' :
                         order.status === 'confirmed' ? 'Confirmé' :
                         order.status === 'shipped' ? 'Expédié' :
                         order.status === 'delivered' ? 'Livré' :
                         order.status === 'cancelled' ? 'Annulé' : order.status}
                      </Badge>
                    </div>
                  </div>
                )) || (
                  <p className="text-center text-muted-foreground py-4">
                    Aucune commande récente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Produits populaires</CardTitle>
              <CardDescription>
                Les produits les plus vendus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData?.popularProducts?.map((product) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded overflow-hidden bg-muted">
                      <img 
                        src={product.images?.[0] || '/placeholder.svg'} 
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{product.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {product.popular || 0} ventes
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(product.discounted_price || product.original_price)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Stock: {product.stock}
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-center text-muted-foreground py-4">
                    Aucun produit populaire
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertes de stock faible */}
        {dashboardData?.lowStockProducts && dashboardData.lowStockProducts.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">Alertes de stock</CardTitle>
              <CardDescription>
                Produits avec un stock faible (moins de 10 unités)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dashboardData.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-2">
                    <div className="font-medium">{product.name}</div>
                    <Badge variant="outline" className="text-yellow-800 border-yellow-300">
                      {product.stock} restant{product.stock > 1 ? 's' : ''}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Métriques de performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData?.conversionRate || 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Visiteurs qui passent commande
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Panier moyen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(dashboardData?.averageOrderValue || 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Valeur moyenne des commandes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Visiteurs aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {dashboardData?.todayVisitors || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Visiteurs uniques
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
