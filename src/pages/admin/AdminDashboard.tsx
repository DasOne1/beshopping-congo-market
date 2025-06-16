
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Clock, 
  Truck, 
  CheckCircle, 
  DollarSign,
  TrendingUp,
  Users,
  Package,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const { stats, recentOrders, topProducts, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Commandes Totales',
      value: stats?.totalOrders || 0,
      change: '+12%',
      changeType: 'positive',
      icon: ShoppingCart,
      color: 'blue',
    },
    {
      title: 'Revenus du Mois',
      value: formatCurrency(stats?.totalRevenue || 0),
      change: '+8.2%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'green',
    },
    {
      title: 'Clients Actifs',
      value: stats?.totalCustomers || 0,
      change: '+3.1%',
      changeType: 'positive',
      icon: Users,
      color: 'purple',
    },
    {
      title: 'Produits en Stock',
      value: stats?.totalProducts || 0,
      change: '-2.4%',
      changeType: 'negative',
      icon: Package,
      color: 'orange',
    },
  ];

  const orderStats = [
    {
      title: 'En Attente',
      value: stats?.pendingOrders || 0,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/10',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      title: 'En Traitement',
      value: stats?.processingOrders || 0,
      icon: Truck,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Expédiées',
      value: stats?.activeOrders || 0,
      icon: TrendingUp,
      color: 'indigo',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/10',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'Livrées',
      value: stats?.completedOrders || 0,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/10',
      iconColor: 'text-green-600 dark:text-green-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre boutique BeShopping
        </p>
      </div>

      {/* Main Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`rounded-lg p-2 bg-${stat.color}-50 dark:bg-${stat.color}-900/10`}>
                    <Icon className={`h-4 w-4 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                    )}
                    <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                      {stat.change}
                    </span>
                    <span>par rapport au mois dernier</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Order Status Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {orderStats.map((stat, index) => {
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
                  <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    commandes {stat.title.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Commandes Récentes</CardTitle>
                <CardDescription>
                  Les dernières commandes reçues
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders?.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground">
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

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Produits Populaires</CardTitle>
                <CardDescription>
                  Top produits par ventes
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts?.slice(0, 5).map((product, index) => (
                  <div key={product.product_name} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/10">
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{product.product_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.total_quantity} vendus • {product.order_count} commandes
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(product.total_revenue)}</p>
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
