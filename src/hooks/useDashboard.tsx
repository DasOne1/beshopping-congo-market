
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  monthlyRevenue: { month: string; revenue: number }[];
  topProducts: { name: string; sales: number }[];
  ordersByStatus: { status: string; count: number }[];
}

export const useDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Statistiques de base
      const [ordersResponse, customersResponse, revenueResponse] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact' }),
        supabase.from('customers').select('*', { count: 'exact' }),
        supabase.from('orders').select('total_amount, status, created_at').eq('status', 'delivered'),
      ]);

      if (ordersResponse.error) throw ordersResponse.error;
      if (customersResponse.error) throw customersResponse.error;
      if (revenueResponse.error) throw revenueResponse.error;

      const totalOrders = ordersResponse.count || 0;
      const totalCustomers = customersResponse.count || 0;
      const totalRevenue = revenueResponse.data?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      // Commandes en attente
      const { count: pendingOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .eq('status', 'pending');

      // Revenus par mois (derniers 6 mois)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: monthlyData } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .eq('status', 'delivered')
        .gte('created_at', sixMonthsAgo.toISOString());

      const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleString('fr-FR', { month: 'long' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        const revenue = monthlyData?.filter(order => {
          const orderDate = new Date(order.created_at);
          return orderDate >= monthStart && orderDate <= monthEnd;
        }).reduce((sum, order) => sum + order.total_amount, 0) || 0;

        return { month: monthName, revenue };
      }).reverse();

      // Produits les plus vendus
      const { data: topProductsData } = await supabase
        .from('products')
        .select('name, popular')
        .order('popular', { ascending: false })
        .limit(5);

      const topProducts = topProductsData?.map(product => ({
        name: product.name,
        sales: product.popular || 0,
      })) || [];

      // Commandes par statut
      const { data: orderStatusData } = await supabase
        .from('orders')
        .select('status');

      const statusCounts = orderStatusData?.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const ordersByStatus = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
      }));

      return {
        totalOrders,
        totalRevenue,
        totalCustomers,
        pendingOrders: pendingOrders || 0,
        monthlyRevenue,
        topProducts,
        ordersByStatus,
      } as DashboardStats;
    },
    refetchInterval: 30000, // Actualiser toutes les 30 secondes
  });

  return {
    stats: stats || {
      totalOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      pendingOrders: 0,
      monthlyRevenue: [],
      topProducts: [],
      ordersByStatus: [],
    },
    isLoading,
  };
};
