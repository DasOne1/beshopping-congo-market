
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: any;
  total_spent?: number;
  orders_count?: number;
  last_order_date?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export const useCustomers = () => {
  const queryClient = useQueryClient();

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

  const createCustomer = useMutation({
    mutationFn: async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
      // Vérifier d'abord si le client existe déjà par téléphone ou email
      let existingCustomer = null;
      
      if (customer.phone) {
        const { data: phoneCustomer } = await supabase
          .from('customers')
          .select('*')
          .eq('phone', customer.phone)
          .single();
        existingCustomer = phoneCustomer;
      }
      
      if (!existingCustomer && customer.email) {
        const { data: emailCustomer } = await supabase
          .from('customers')
          .select('*')
          .eq('email', customer.email)
          .single();
        existingCustomer = emailCustomer;
      }

      if (existingCustomer) {
        return existingCustomer;
      }

      // Créer un nouveau client
      const { data, error } = await supabase
        .from('customers')
        .insert([{
          ...customer,
          total_spent: 0,
          orders_count: 0,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      
      // Ne pas afficher de toast si c'est un client existant
      if (data.created_at && new Date(data.created_at).getTime() > Date.now() - 5000) {
        toast({
          title: "Client créé",
          description: "Le client a été créé avec succès",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateCustomerStats = useMutation({
    mutationFn: async ({ customerId, orderAmount }: { customerId: string; orderAmount: number }) => {
      // Récupérer les statistiques actuelles du client
      const { data: currentCustomer, error: fetchError } = await supabase
        .from('customers')
        .select('total_spent, orders_count')
        .eq('id', customerId)
        .single();

      if (fetchError) throw fetchError;

      const newTotalSpent = (currentCustomer.total_spent || 0) + orderAmount;
      const newOrdersCount = (currentCustomer.orders_count || 0) + 1;

      // Mettre à jour les statistiques
      const { data, error } = await supabase
        .from('customers')
        .update({
          total_spent: newTotalSpent,
          orders_count: newOrdersCount,
          last_order_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', customerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
    onError: (error: any) => {
      console.error('Erreur lors de la mise à jour des statistiques client:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les statistiques du client",
        variant: "destructive",
      });
    },
  });

  const updateCustomer = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Customer> & { id: string }) => {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Client mis à jour",
        description: "Le client a été mis à jour avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCustomer = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    customers,
    isLoading,
    createCustomer,
    updateCustomer,
    updateCustomerStats,
    deleteCustomer,
  };
};
