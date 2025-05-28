
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
  }>;
  recentOrders: Array<{
    id: string;
    total_amount: number;
    customer_name: string;
    created_at: string;
  }>;
}

export const useDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      // Get total orders
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      // Get total products
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Get total customers
      const { count: totalCustomers } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      // Get total revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'delivered');

      const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      // Get top products
      const { data: topProducts } = await supabase
        .from('products')
        .select('id, name, popular')
        .order('popular', { ascending: false })
        .limit(5);

      // Get recent orders
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('id, total_amount, customer_name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      return {
        totalOrders: totalOrders || 0,
        totalProducts: totalProducts || 0,
        totalCustomers: totalCustomers || 0,
        totalRevenue,
        topProducts: topProducts?.map(p => ({
          id: p.id,
          name: p.name,
          sales: p.popular || 0
        })) || [],
        recentOrders: recentOrders || []
      };
    },
  });

  return { stats, isLoading };
};
