
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  created_at?: string;
  orders_count?: number;
  total_spent?: number;
  status?: string;
}

export const useCustomers = () => {
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Customer[];
    },
  });

  return {
    customers,
    isLoading,
  };
};
