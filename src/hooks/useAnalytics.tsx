
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
  event_type: string;
  user_id?: string;
  session_id?: string;
  product_id?: string;
  category_id?: string;
  order_id?: string;
  event_data?: any;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
}

export const useAnalytics = () => {
  const queryClient = useQueryClient();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_analytics_stats');
      
      if (error) throw error;
      
      return data as AnalyticsStats;
    },
  });

  const trackEvent = useMutation({
    mutationFn: async (event: Omit<AnalyticsEvent, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('analytics_events')
        .insert([{
          ...event,
          session_id: event.session_id || crypto.randomUUID(),
          user_agent: navigator.userAgent,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Optionnellement invalider les stats pour les mettre à jour
      queryClient.invalidateQueries({ queryKey: ['analytics-stats'] });
    },
  });

  return {
    analytics,
    isLoading,
    trackEvent,
  };
};
