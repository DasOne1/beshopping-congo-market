import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  activeOrders: number;
  completedOrders: number;
  lowStockProducts: number;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    stock: number;
  }>;
  recentOrders: Array<{
    id: string;
    total_amount: number;
    customer_name: string;
    created_at: string;
    status: string;
  }>;
  monthlyStats: {
    orders: number;
    revenue: number;
    newCustomers: number;
    previousMonthComparison: {
      orders: number;
      revenue: number;
      newCustomers: number;
    };
  };
}

export const useDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // Obtenir la date du premier jour du mois actuel
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      // Obtenir la date du premier jour du mois précédent
      const firstDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Récupérer toutes les commandes
      const { data: allOrders } = await supabase
        .from('orders')
        .select('*');

      // Récupérer tous les produits
      const { data: allProducts } = await supabase
        .from('products')
        .select('*');

      // Récupérer tous les clients
      const { data: allCustomers } = await supabase
        .from('customers')
        .select('*');

      // Calculer les statistiques globales
      const totalOrders = allOrders?.length || 0;
      const totalProducts = allProducts?.length || 0;
      const totalCustomers = allCustomers?.length || 0;

      // Calculer les revenus totaux (uniquement des commandes livrées)
      const totalRevenue = allOrders
        ?.filter(o => o.status === 'delivered')
        .reduce((sum, order) => sum + order.total_amount, 0) || 0;

      // Calculer les commandes par statut
      const pendingOrders = allOrders?.filter(o => o.status === 'pending').length || 0;
      const activeOrders = allOrders?.filter(o => o.status === 'processing' || o.status === 'shipped').length || 0;
      const completedOrders = allOrders?.filter(o => o.status === 'delivered').length || 0;

      // Calculer les produits en stock faible
      const lowStockProducts = allProducts?.filter(p => (p.stock || 0) < 5).length || 0;

      // Calculer les produits les plus vendus
      const topProducts = allProducts
        ?.map(p => ({
          id: p.id,
          name: p.name,
          sales: p.popular || 0,
          stock: p.stock || 0
        }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5) || [];

      // Récupérer les commandes récentes
      const recentOrders = allOrders
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5)
        .map(order => ({
          id: order.id,
          total_amount: order.total_amount,
          customer_name: order.customer_name,
          created_at: order.created_at,
          status: order.status
        })) || [];

      // Calculer les statistiques du mois actuel
      const currentMonthOrders = allOrders?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= firstDayOfMonth && orderDate <= lastDayOfMonth;
      }) || [];

      const currentMonthCustomers = allCustomers?.filter(customer => {
        const customerDate = new Date(customer.created_at);
        return customerDate >= firstDayOfMonth && customerDate <= lastDayOfMonth;
      }) || [];

      // Calculer les statistiques du mois précédent
      const previousMonthOrders = allOrders?.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= firstDayOfPreviousMonth && orderDate <= lastDayOfPreviousMonth;
      }) || [];

      const previousMonthCustomers = allCustomers?.filter(customer => {
        const customerDate = new Date(customer.created_at);
        return customerDate >= firstDayOfPreviousMonth && customerDate <= lastDayOfPreviousMonth;
      }) || [];

      const monthlyStats = {
        orders: currentMonthOrders.length,
        revenue: currentMonthOrders
          .filter(o => o.status === 'delivered')
          .reduce((sum, order) => sum + order.total_amount, 0),
        newCustomers: currentMonthCustomers.length,
        previousMonthComparison: {
          orders: previousMonthOrders.length,
          revenue: previousMonthOrders
            .filter(o => o.status === 'delivered')
            .reduce((sum, order) => sum + order.total_amount, 0),
          newCustomers: previousMonthCustomers.length
        }
      };

      return {
        totalOrders,
        totalProducts,
        totalCustomers,
        totalRevenue,
        pendingOrders,
        activeOrders,
        completedOrders,
        lowStockProducts,
        topProducts,
        recentOrders,
        monthlyStats
      };
    },
    refetchInterval: 60000, // Actualiser chaque minute
  });

  return { stats, isLoading };
};
