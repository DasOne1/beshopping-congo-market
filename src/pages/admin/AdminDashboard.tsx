
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Clock, 
  Truck, 
  CheckCircle, 
  DollarSign,
  TrendingUp} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { formatCurrency } from '@/lib/utils';

const AdminDashboard = () => {
  const { stats, recentOrders, topProducts, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Commandes',
      value: stats?.totalOrders || 0,
      change: '+12%',
      icon: ShoppingCart,
      color: 'blue',
    },
    {
      title: 'En Attente',
      value: stats?.pendingOrders || 0,
      change: '+5%',
      icon: Clock,
      color: 'yellow',
    },
    {
      title: 'En Cours',
      value: stats?.processingOrders || 0,
      change: '+8%',
      icon: Truck,
      color: 'orange',
    },
    {
      title: 'Terminées',
      value: stats?.completedOrders || 0,
      change: '+15%',
      icon: CheckCircle,
      color: 'green',
    },
  ];

  const periodStats = [
    {
      title: 'Revenus Total',
      value: formatCurrency(stats?.totalRevenue || 0),
      icon: DollarSign,
      color: 'emerald',
    },
    {
      title: "Aujourd'hui",
      value: stats?.todayOrders || 0,
      subtitle: 'commandes',
      icon: TrendingUp,
      color: 'blue',
    },
    {
      title: 'Ce Mois',
      value: stats?.monthlyOrders || 0,
      subtitle: 'commandes',
      icon: TrendingUp,
      color: 'purple',
    },
    {
      title: 'Cette Année',
      value: stats?.yearlyOrders || 0,
      subtitle: 'commandes',
      icon: TrendingUp,
      color: 'indigo',
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Administrateur
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Vue d'ensemble de votre boutique BeShopping
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 text-${stat.color}-600`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={`text-${stat.color}-600`}>
                      {stat.change}
                    </span>{' '}
                    par rapport au mois dernier
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Statistiques par période */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {periodStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 4) * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 text-${stat.color}-600`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.subtitle && (
                    <p className="text-xs text-muted-foreground">
                      {stat.subtitle}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Commandes récentes et produits populaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commandes récentes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Commandes Récentes</CardTitle>
              <CardDescription>
                Les 10 dernières commandes reçues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders?.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">
                        {order.order_number}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        order.status === 'delivered' ? 'default' :
                        order.status === 'pending' ? 'secondary' : 'outline'
                      }>
                        {order.status}
                      </Badge>
                      <span className="text-sm font-medium">
                        {formatCurrency(order.total_amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Produits populaires */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Produits les Plus Commandés</CardTitle>
              <CardDescription>
                Top 5 des produits par quantité vendue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts?.slice(0, 5).map((product, index) => (
                  <div key={product.product_name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{product.product_name}</p>
                        <p className="text-xs text-gray-500">
                          {product.order_count} commandes
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{product.total_quantity} vendus</p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(product.total_revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
