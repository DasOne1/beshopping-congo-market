
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboard } from '@/hooks/useDashboard';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { useCustomers } from '@/hooks/useCustomers';
import { ShoppingBag, Package, Users, TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { stats, isLoading: isLoadingStats } = useDashboard();
  const { orders, isLoading: isLoadingOrders } = useOrders();
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { customers, isLoading: isLoadingCustomers } = useCustomers();

  // Calculer les statistiques en temps réel depuis les données
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const totalRevenue = orders
    .filter(order => order.status === 'completed')
    .reduce((sum, order) => sum + (order.total_amount || 0), 0);

  // Récentes commandes (5 dernières)
  const recentOrders = orders
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Produits les plus populaires
  const popularProducts = products
    .sort((a, b) => (b.popular || 0) - (a.popular || 0))
    .slice(0, 5);

  const statCards = [
    {
      title: "Commandes totales",
      value: totalOrders,
      description: "Toutes les commandes",
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Revenus totaux",
      value: `${totalRevenue.toFixed(2)} €`,
      description: "Commandes terminées",
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Produits",
      value: products.length,
      description: "Total des produits",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Clients",
      value: customers.length,
      description: "Clients enregistrés",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    }
  ];

  const orderStatCards = [
    {
      title: "En attente",
      value: pendingOrders,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Terminées",
      value: completedOrders,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'outline' as const },
      processing: { label: 'En cours', variant: 'default' as const },
      completed: { label: 'Terminée', variant: 'default' as const },
      cancelled: { label: 'Annulée', variant: 'destructive' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
                  { label: status, variant: 'outline' as const };

    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  if (isLoadingStats || isLoadingOrders || isLoadingProducts || isLoadingCustomers) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Tableau de Bord</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre commerce</p>
      </motion.div>

      {/* Statistiques principales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Statistiques des commandes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {orderStatCards.map((stat, index) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commandes {stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commandes récentes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Commandes Récentes</CardTitle>
              <CardDescription>Les 5 dernières commandes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.total_amount} €</p>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Aucune commande récente
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Produits populaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Produits Populaires</CardTitle>
              <CardDescription>Les produits les plus demandés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {product.images && product.images[0] && (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.original_price} €</p>
                      <p className="text-sm text-muted-foreground">
                        {product.popular || 0} commandes
                      </p>
                    </div>
                  </div>
                ))}
                {popularProducts.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Aucun produit populaire
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
