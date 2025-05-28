
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsEvent {
  id: string;
  event_type: 'view_product' | 'add_to_cart' | 'purchase' | 'search';
  customer_id?: string;
  product_id?: string;
  session_id?: string;
  metadata?: any;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

export interface AnalyticsData {
  totalViews: number;
  totalPurchases: number;
  conversionRate: number;
  averageOrderValue: number;
  topProducts: { product_name: string; views: number; sales: number }[];
  salesByDay: { date: string; sales: number; revenue: number }[];
  customerSegments: { segment: string; count: number; revenue: number }[];
}

export const useAnalytics = () => {
  const queryClient = useQueryClient();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      // Événements analytiques
      const { data: events, error: eventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (eventsError) throw eventsError;

      // Commandes pour les calculs
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            products(name)
          )
        `);

      if (ordersError) throw ordersError;

      // Calculs des métriques
      const totalViews = events?.filter(e => e.event_type === 'view_product').length || 0;
      const totalPurchases = events?.filter(e => e.event_type === 'purchase').length || 0;
      const conversionRate = totalViews > 0 ? (totalPurchases / totalViews) * 100 : 0;

      const deliveredOrders = orders?.filter(o => o.status === 'delivered') || [];
      const averageOrderValue = deliveredOrders.length > 0 
        ? deliveredOrders.reduce((sum, order) => sum + order.total_amount, 0) / deliveredOrders.length 
        : 0;

      // Produits les plus vus/vendus
      const productViews = events?.filter(e => e.event_type === 'view_product' && e.product_id) || [];
      const productViewCounts = productViews.reduce((acc, event) => {
        acc[event.product_id!] = (acc[event.product_id!] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Ventes par jour (derniers 30 jours)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentOrders = deliveredOrders.filter(order => 
        new Date(order.created_at!) >= thirtyDaysAgo
      );

      const salesByDay = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOrders = recentOrders.filter(order => 
          order.created_at?.startsWith(dateStr)
        );
        
        return {
          date: dateStr,
          sales: dayOrders.length,
          revenue: dayOrders.reduce((sum, order) => sum + order.total_amount, 0)
        };
      }).reverse();

      // Segments de clients
      const { data: customers } = await supabase
        .from('customers')
        .select('*');

      const customerSegments = [
        {
          segment: 'Nouveaux clients',
          count: customers?.filter(c => (c.orders_count || 0) <= 1).length || 0,
          revenue: customers?.filter(c => (c.orders_count || 0) <= 1)
            .reduce((sum, c) => sum + (c.total_spent || 0), 0) || 0
        },
        {
          segment: 'Clients réguliers',
          count: customers?.filter(c => (c.orders_count || 0) >= 2 && (c.orders_count || 0) <= 5).length || 0,
          revenue: customers?.filter(c => (c.orders_count || 0) >= 2 && (c.orders_count || 0) <= 5)
            .reduce((sum, c) => sum + (c.total_spent || 0), 0) || 0
        },
        {
          segment: 'Clients VIP',
          count: customers?.filter(c => (c.orders_count || 0) > 5).length || 0,
          revenue: customers?.filter(c => (c.orders_count || 0) > 5)
            .reduce((sum, c) => sum + (c.total_spent || 0), 0) || 0
        }
      ];

      return {
        totalViews,
        totalPurchases,
        conversionRate,
        averageOrderValue,
        topProducts: [], // Simplifié pour cette version
        salesByDay,
        customerSegments,
      } as AnalyticsData;
    },
    refetchInterval: 60000, // Actualiser chaque minute
  });

  const trackEvent = useMutation({
    mutationFn: async (event: Omit<AnalyticsEvent, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('analytics_events')
        .insert([event])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });

  return {
    analytics: analytics || {
      totalViews: 0,
      totalPurchases: 0,
      conversionRate: 0,
      averageOrderValue: 0,
      topProducts: [],
      salesByDay: [],
      customerSegments: [],
    },
    isLoading,
    trackEvent,
  };
};
