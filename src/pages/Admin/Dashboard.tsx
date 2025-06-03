import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Badge } from '@/components/ui/badge';

// Fonction utilitaire pour formater les prix
const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

const Dashboard = () => {
  const { stats, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </CardHeader>
              </Card>
            ))}
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tableau de bord</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Vue d'ensemble de votre activité
            </p>
          </div>
        </div>
        
        {/* Statistiques principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes du mois</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.monthlyStats.orders || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.monthlyStats.orders > 0 ? (
                  <span className="flex items-center text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {((stats.monthlyStats.orders / stats.totalOrders) * 100).toFixed(1)}% du total
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    Aucune commande ce mois
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus du mois</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatPrice(stats?.monthlyStats.revenue || 0)} FC
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.monthlyStats.revenue > 0 ? (
                  <span className="flex items-center text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {((stats.monthlyStats.revenue / stats.totalRevenue) * 100).toFixed(1)}% du total
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    Aucun revenu ce mois
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nouveaux clients</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats?.monthlyStats.newCustomers || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.monthlyStats.newCustomers > 0 ? (
                  <span className="flex items-center text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {((stats.monthlyStats.newCustomers / stats.totalCustomers) * 100).toFixed(1)}% du total
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                    Aucun nouveau client ce mois
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produits en alerte</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats?.lowStockProducts || 0}</div>
              <p className="text-xs text-muted-foreground">
                Produits avec stock &lt; 5 unités
              </p>
            </CardContent>
          </Card>
        </div>

        {/* État des commandes */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats?.pendingOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                Commandes à traiter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En cours</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats?.activeOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                Commandes en traitement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terminées</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.completedOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                Commandes livrées
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Produits populaires et commandes récentes */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Produits Populaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.topProducts?.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Stock: {product.stock} unités
                      </span>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {product.sales} ventes
                    </Badge>
                  </div>
                )) || (
                  <p className="text-gray-500 text-sm">Aucune donnée disponible</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Commandes Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.recentOrders?.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{order.customer_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-sm text-green-600 font-semibold">
                        {formatPrice(order.total_amount)} FC
                      </span>
                      <Badge 
                        variant={
                          order.status === 'delivered' ? 'default' :
                          order.status === 'pending' ? 'secondary' :
                          order.status === 'cancelled' ? 'destructive' :
                          'outline'
                        }
                        className="mt-1"
                      >
                        {order.status === 'delivered' ? 'Livrée' :
                         order.status === 'pending' ? 'En attente' :
                         order.status === 'processing' ? 'En cours' :
                         order.status === 'shipped' ? 'Expédiée' :
                         order.status === 'cancelled' ? 'Annulée' :
                         order.status}
                      </Badge>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-sm">Aucune commande récente</p>
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
