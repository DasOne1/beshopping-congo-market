
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Order } from '@/types';

export const useCachedOrders = () => {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ['orders-cached'],
    queryFn: async () => {
      console.log('Chargement des commandes avec cache...');
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          customer_id,
          customer_name,
          customer_email,
          customer_phone,
          shipping_address,
          total_amount,
          subtotal,
          status,
          payment_status,
          created_at,
          updated_at,
          order_items!inner(
            id,
            product_name,
            quantity,
            unit_price,
            total_price
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50); // Limiter le nombre de commandes pour améliorer les performances

      if (error) throw error;
      console.log('Commandes cachées chargées:', data?.length);
      return data as Order[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order['status'] }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Order;
    },
    onMutate: async ({ id, status }) => {
      // Mise à jour optimiste
      await queryClient.cancelQueries({ queryKey: ['orders-cached'] });
      
      const previousOrders = queryClient.getQueryData<Order[]>(['orders-cached']);
      
      queryClient.setQueryData<Order[]>(['orders-cached'], old => 
        old ? old.map(order => 
          order.id === id ? { ...order, status } : order
        ) : []
      );
      
      return { previousOrders };
    },
    onError: (err, variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders-cached'], context.previousOrders);
      }
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été mis à jour",
      });
    },
  });

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['orders-cached'] });
      
      const previousOrders = queryClient.getQueryData<Order[]>(['orders-cached']);
      
      queryClient.setQueryData<Order[]>(['orders-cached'], old => 
        old ? old.filter(order => order.id !== id) : []
      );
      
      return { previousOrders };
    },
    onError: (err, variables, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(['orders-cached'], context.previousOrders);
      }
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la commande",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Commande supprimée",
        description: "La commande a été supprimée avec succès",
      });
    },
  });

  return {
    orders,
    isLoading,
    updateOrderStatus,
    deleteOrder,
  };
};
