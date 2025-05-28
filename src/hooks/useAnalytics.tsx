
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsStats {
  total_orders: number;
  total_revenue: number;
  average_order_value: number;
  total_customers: number;
  top_products: Array<{
    product_name: string;
    quantity_sold: number;
    revenue: number;
  }>;
  orders_by_status: Record<string, number>;
}

export interface AnalyticsEvent {
  id?: string;
  event_type: 'view_product' | 'add_to_cart' | 'purchase' | 'search';
  customer_id?: string;
  session_id?: string;
  product_id?: string;
  metadata?: any;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

export const useAnalytics = () => {
  const queryClient = useQueryClient();

  // For now, we'll create a mock analytics stats query until we have the RPC function
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async () => {
      // Get basic stats from existing tables
      const [ordersData, customersData] = await Promise.all([
        supabase.from('orders').select('total_amount, status'),
        supabase.from('customers').select('id')
      ]);
      
      const orders = ordersData.data || [];
      const customers = customersData.data || [];
      
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const totalCustomers = customers.length;
      
      // Count orders by status
      const ordersByStatus = orders.reduce((acc, order) => {
        acc[order.status || 'unknown'] = (acc[order.status || 'unknown'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return {
        total_orders: totalOrders,
        total_revenue: totalRevenue,
        average_order_value: averageOrderValue,
        total_customers: totalCustomers,
        top_products: [],
        orders_by_status: ordersByStatus
      } as AnalyticsStats;
    },
  });

  const trackEvent = useMutation({
    mutationFn: async (event: Omit<AnalyticsEvent, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('analytics_events')
        .insert([{
          event_type: event.event_type,
          customer_id: event.customer_id,
          product_id: event.product_id,
          session_id: event.session_id || crypto.randomUUID(),
          user_agent: event.user_agent || navigator.userAgent,
          metadata: event.metadata,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics-stats'] });
    },
  });

  return {
    analytics,
    isLoading,
    trackEvent,
  };
};
