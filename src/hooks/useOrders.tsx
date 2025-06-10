
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useGlobalStore } from '@/store/useGlobalStore';
import { useOptimizedOrders } from './useOptimizedData';

export const useOrders = () => {
  const { orders, isLoading, refetch } = useOptimizedOrders();
  const { addOrder, updateOrder, removeOrder } = useGlobalStore();

  const createOrder = useMutation({
    mutationFn: async (order: any) => {
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newOrder) => {
      const optimisticOrder = {
        ...newOrder,
        id: `temp-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        order_number: `ORD-${Date.now()}`,
      };
      addOrder(optimisticOrder);
      return optimisticOrder;
    },
    onSuccess: (data, variables, context) => {
      if (context) {
        removeOrder(context.id);
        addOrder(data);
      }
      toast({
        title: "Commande créée",
        description: "La commande a été créée avec succès",
      });
    },
    onError: (error: any, variables, context) => {
      if (context) {
        removeOrder(context.id);
      }
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async ({ id, status }) => {
      updateOrder(id, { status });
      return { id, status };
    },
    onSuccess: () => {
      toast({
        title: "Commande mise à jour",
        description: "Le statut de la commande a été mis à jour",
      });
    },
    onError: (error: any, variables, context) => {
      refetch();
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
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
      return id;
    },
    onMutate: async (id) => {
      removeOrder(id);
      return { id };
    },
    onSuccess: () => {
      toast({
        title: "Commande supprimée",
        description: "La commande a été supprimée avec succès",
      });
    },
    onError: (error: any, variables, context) => {
      refetch();
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    orders,
    isLoading,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    refetch,
  };
};
