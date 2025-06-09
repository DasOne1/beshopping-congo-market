
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, ShoppingCart, Package, DollarSign, Calendar, Eye } from 'lucide-react';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { formatCurrency } from '@/lib/utils';

const AdminAnalytics = () => {
  const { stats, topProducts, isLoading } = useAdminDashboard();
  const [timePeriod, setTimePeriod] = useState('month');

  // Données de démonstration pour les graphiques
  const salesData = [
    { name: 'Jan', ventes: 4000, commandes: 240 },
    { name: 'Fév', ventes: 3000, commandes: 139 },
    { name: 'Mar', ventes: 2000, commandes: 980 },
    { name: 'Avr', ventes: 2780, commandes: 390 },
    { name: 'Mai', ventes: 1890, commandes: 480 },
    { name: 'Jun', ventes: 2390, commandes: 380 },
    { name: 'Jul', ventes: 3490, commandes: 430 }
  ];

  const categoryData = [
    { name: 'Électronique', value: 400, color: '#8884d8' },
    { name: 'Vêtements', value: 300, color: '#82ca9d' },
    { name: 'Maison', value: 200, color: '#ffc658' },
    { name: 'Sports', value: 100, color: '#ff7300' }
  ];

  const trafficData = [
    { name: 'Lun', visiteurs: 1200, vues: 2400 },
    { name: 'Mar', visiteurs: 1900, vues: 1398 },
    { name: 'Mer', visiteurs: 800, vues: 9800 },
    { name: 'Jeu', visiteurs: 3908, vues: 3908 },
    { name: 'Ven', visiteurs: 4800, vues: 4800 },
    { name: 'Sam', visiteurs: 3800, vues: 3800 },
    { name: 'Dim', visiteurs: 4300, vues: 4300 }
  ];

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% vs mois dernier
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
              +8.2% vs mois dernier
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -0.4% vs mois dernier
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
              {formatCurrency(stats?.totalOrders ? (stats.totalRevenue / stats.totalOrders) : 0)}
            </div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +4.1% vs mois dernier
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
            <CardTitle>Répartition par catégorie</CardTitle>
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
                <Tooltip formatter={(value) => [value, 'Ventes']} />
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
            <div className="text-3xl font-bold">24,386</div>
            <div className="flex items-center text-sm text-green-600 mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              +15.3% ce mois
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
            <div className="text-3xl font-bold">8,549</div>
            <div className="flex items-center text-sm text-green-600 mt-2">
              <TrendingUp className="h-4 w-4 mr-1" />
              +7.8% ce mois
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
            <div className="text-3xl font-bold">12</div>
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
