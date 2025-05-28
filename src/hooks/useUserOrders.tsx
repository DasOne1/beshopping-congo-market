
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserOrder {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  customer_name: string;
  order_items?: Array<{
    id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    product_image?: string;
  }>;
}

export const useUserOrders = () => {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserOrder[];
    },
  });

  return {
    orders,
    isLoading,
  };
};
