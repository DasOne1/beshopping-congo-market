import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, Package, Users, TrendingUp, Loader2 } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import AdminLayout from '@/components/Admin/AdminLayout';

interface DashboardData {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  average_order_value: number;
  recent_orders: {
    id: string;
    order_number: string;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
  }[];
  top_products: {
    id: string;
    name: string;
    total_sales: number;
  }[];
  low_stock_products: {
    id: string;
    name: string;
    stock: number;
  }[];
}

const Dashboard = () => {
  const { stats: dashboard, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  if (!dashboard) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Aucune donnée disponible</p>
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
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{dashboard.totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                +2.1% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dashboard.topProducts?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                +4 nouveaux cette semaine
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{dashboard.totalCustomers || 0}</div>
              <p className="text-xs text-muted-foreground">
                +12 nouveaux ce mois
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {dashboard.totalRevenue ? `${dashboard.totalRevenue.toLocaleString()} FC` : '0 FC'}
              </div>
              <p className="text-xs text-muted-foreground">
                +8.3% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Produits Populaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboard.topProducts?.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium">{product.name}</span>
                    <span className="text-sm text-blue-600 font-semibold">{product.sales} ventes</span>
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
                {dashboard.recentOrders?.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium">Commande #{order.id.slice(0, 8)}</span>
                    <span className="text-sm text-green-600 font-semibold">{order.total_amount} FC</span>
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
