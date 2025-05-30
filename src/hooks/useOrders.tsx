import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useCustomers } from './useCustomers';

export interface OrderItem {
  id: string;
  product_id?: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  whatsapp_number?: string;
  shipping_address?: any;
  total_amount: number;
  subtotal: number;
  tax_amount?: number;
  shipping_amount?: number;
  discount_amount?: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method?: string;
  payment_status?: string;
  notes?: string;
  tracking_number?: string;
  created_at?: string;
  updated_at?: string;
  order_items?: OrderItem[];
}

export const useOrders = () => {
  const queryClient = useQueryClient();
  const { updateCustomerStats } = useCustomers();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });

  const { data: recentOrders = [] } = useQuery({
    queryKey: ['orders', 'recent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as Order[];
    },
  });

  const createOrder = useMutation({
    mutationFn: async ({ order, items }: { order: Omit<Order, 'id' | 'order_number' | 'created_at' | 'updated_at'>, items: Omit<OrderItem, 'id' | 'order_id'>[] }) => {
      // Générer le numéro de commande
      const { data: orderNumber } = await supabase.rpc('generate_order_number');
      
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert([{ ...order, order_number: orderNumber }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Ajouter les articles de la commande
      const orderItemsWithOrderId = items.map(item => ({
        ...item,
        order_id: newOrder.id,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsWithOrderId);

      if (itemsError) throw itemsError;

      // Mettre à jour les statistiques du client si un customer_id est fourni
      if (order.customer_id) {
        try {
          await updateCustomerStats.mutateAsync({
            customerId: order.customer_id,
            orderAmount: order.total_amount
          });
        } catch (error) {
          console.error('Erreur lors de la mise à jour des statistiques client:', error);
        }
      }

      return newOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Commande créée",
        description: "La commande a été créée avec succès",
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

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order['status'] }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été mis à jour",
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

  const deleteOrder = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast({
        title: "Commande supprimée",
        description: "La commande a été supprimée avec succès",
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
    orders,
    recentOrders,
    isLoading,
    createOrder,
    updateOrderStatus,
    deleteOrder,
  };
};
