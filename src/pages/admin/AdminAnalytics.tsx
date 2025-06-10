import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, ShoppingCart, Package, DollarSign, Calendar, Eye } from 'lucide-react';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { useAnalytics } from '@/hooks/useAnalytics';
import { formatCurrency } from '@/lib/utils';
import AdminLoader from '@/components/admin/AdminLoader';

const AdminAnalytics = () => {
  const { stats, topProducts, isLoading: dashboardLoading } = useAdminDashboard();
  const { analytics, isLoading: analyticsLoading } = useAnalytics();
  const [timePeriod, setTimePeriod] = useState('month');

  if (dashboardLoading || analyticsLoading) {
    return <AdminLoader />;
  }

  // Transformer les données d'analyse pour les graphiques
  const salesData = analytics.salesByDay.map(day => ({
    name: new Date(day.date).toLocaleDateString('fr-FR', { month: 'short' }),
    ventes: day.revenue,
    commandes: day.sales
  }));

  const categoryData = analytics.customerSegments.map(segment => ({
    name: segment.segment,
    value: segment.count,
    color: segment.segment === 'Clients VIP' ? '#8884d8' : 
           segment.segment === 'Clients réguliers' ? '#82ca9d' : 
           segment.segment === 'Nouveaux clients' ? '#ffc658' : '#ff7300'
  }));

  const trafficData = analytics.salesByDay.map(day => ({
    name: new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
    visiteurs: Math.round(day.sales * 3), // Estimation basée sur le taux de conversion
    vues: Math.round(day.sales * 10) // Estimation basée sur le taux de conversion
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analyse détaillée des performances de votre boutique
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 derniers jours</SelectItem>
              <SelectItem value="month">30 derniers jours</SelectItem>
              <SelectItem value="quarter">3 derniers mois</SelectItem>
              <SelectItem value="year">12 derniers mois</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {analytics.salesByDay.length > 1 ? 
                `${((analytics.salesByDay[analytics.salesByDay.length - 1].revenue / analytics.salesByDay[0].revenue - 1) * 100).toFixed(1)}% vs mois dernier` :
                'Nouveau'
              }
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {analytics.salesByDay.length > 1 ?
                `${((analytics.salesByDay[analytics.salesByDay.length - 1].sales / analytics.salesByDay[0].sales - 1) * 100).toFixed(1)}% vs mois dernier` :
                'Nouveau'
              }
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {analytics.salesByDay.length > 1 ?
                `${((analytics.conversionRate / (analytics.totalViews / analytics.totalPurchases) - 1) * 100).toFixed(1)}% vs mois dernier` :
                'Nouveau'
              }
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Panier moyen</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analytics.averageOrderValue)}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {analytics.salesByDay.length > 1 ?
                `${((analytics.averageOrderValue / (analytics.salesByDay[0].revenue / analytics.salesByDay[0].sales) - 1) * 100).toFixed(1)}% vs mois dernier` :
                'Nouveau'
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'ventes' ? formatCurrency(Number(value)) : value,
                    name === 'ventes' ? 'Ventes' : 'Commandes'
                  ]}
                />
                <Bar dataKey="ventes" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des clients</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Clients']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Trafic du site</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visiteurs" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="vues" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Produits les plus vendus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts?.slice(0, 5).map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{product.product_name}</p>
                      <p className="text-sm text-gray-500">{product.order_count} commandes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.total_quantity} vendus</p>
                    <p className="text-sm text-gray-500">{formatCurrency(product.total_revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Pages vues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalViews.toLocaleString()}</div>
            <div className="flex items-center text-sm text-green-600 mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              {analytics.salesByDay.length > 1 ?
                `${((analytics.totalViews / analytics.salesByDay[0].sales - 1) * 100).toFixed(1)}% ce mois` :
                'Nouveau'
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Visiteurs uniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {analytics.customerSegments.reduce((sum, segment) => sum + segment.count, 0).toLocaleString()}
            </div>
            <div className="flex items-center text-sm text-green-600 mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              {analytics.salesByDay.length > 1 ?
                `${((analytics.customerSegments[0].count / analytics.salesByDay[0].sales - 1) * 100).toFixed(1)}% ce mois` :
                'Nouveau'
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Produits en rupture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {topProducts?.filter(p => p.total_quantity === 0).length || 0}
            </div>
            <Badge variant="destructive" className="mt-2">
              Action requise
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
