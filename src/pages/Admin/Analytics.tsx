
import React from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, ShoppingCart, DollarSign, Eye, Target, Award } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useAuth } from '@/hooks/useAuth';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function Analytics() {
  const { isAuthenticated } = useAuth();
  const { analytics, isLoading } = useAnalytics();

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Chargement des analytics...</p>
        </div>
      </AdminLayout>
    );
  }

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

  const formatPercent = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Rapports</h1>
          <p className="text-muted-foreground">
            Analysez les performances de votre boutique
          </p>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vues Produits</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analytics.totalViews)}</div>
              <p className="text-xs text-muted-foreground">
                Total des vues de produits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achats</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(analytics.totalPurchases)}</div>
              <p className="text-xs text-muted-foreground">
                Nombre total d'achats
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPercent(analytics.conversionRate)}</div>
              <p className="text-xs text-muted-foreground">
                Vues → Achats
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Panier Moyen</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analytics.averageOrderValue)}</div>
              <p className="text-xs text-muted-foreground">
                Valeur moyenne des commandes
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ventes par jour */}
          <Card>
            <CardHeader>
              <CardTitle>Ventes des 30 derniers jours</CardTitle>
              <CardDescription>Évolution quotidienne des ventes et revenus</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis yAxisId="sales" orientation="left" />
                  <YAxis yAxisId="revenue" orientation="right" tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'sales' ? 'Ventes' : 'Revenus'
                    ]}
                    labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR')}
                  />
                  <Line yAxisId="sales" type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                  <Line yAxisId="revenue" type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Segments de clients */}
          <Card>
            <CardHeader>
              <CardTitle>Segments de Clients</CardTitle>
              <CardDescription>Répartition des clients par comportement d'achat</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.customerSegments}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ segment, count }) => `${segment}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.customerSegments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number, name: string) => [value, name === 'count' ? 'Clients' : 'Revenus']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Revenus par segment */}
        <Card>
          <CardHeader>
            <CardTitle>Revenus par Segment de Clients</CardTitle>
            <CardDescription>Contribution de chaque segment aux revenus totaux</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.customerSegments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="segment" />
                <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Revenus']}
                />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Résumé des performances */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance Globale</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Taux de conversion</span>
                  <span className="text-sm font-medium">{formatPercent(analytics.conversionRate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Panier moyen</span>
                  <span className="text-sm font-medium">{formatCurrency(analytics.averageOrderValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total vues</span>
                  <span className="text-sm font-medium">{formatNumber(analytics.totalViews)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Nouveaux</span>
                  <span className="text-sm font-medium">{analytics.customerSegments[0]?.count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Réguliers</span>
                  <span className="text-sm font-medium">{analytics.customerSegments[1]?.count || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">VIP</span>
                  <span className="text-sm font-medium">{analytics.customerSegments[2]?.count || 0}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus par Segment</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Nouveaux</span>
                  <span className="text-sm font-medium">{formatCurrency(analytics.customerSegments[0]?.revenue || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Réguliers</span>
                  <span className="text-sm font-medium">{formatCurrency(analytics.customerSegments[1]?.revenue || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">VIP</span>
                  <span className="text-sm font-medium">{formatCurrency(analytics.customerSegments[2]?.revenue || 0)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
