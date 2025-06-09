
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { subDays, startOfDay, endOfDay } from 'date-fns';

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  todayOrders: number;
  monthlyOrders: number;
  yearlyOrders: number;
}

export interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface TopProduct {
  product_name: string;
  total_quantity: number;
  total_revenue: number;
  order_count: number;
}

export const useAdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      const today = new Date();
      const startOfToday = startOfDay(today);
      const endOfToday = endOfDay(today);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfYear = new Date(today.getFullYear(), 0, 1);

      // Récupérer toutes les commandes
      const { data: allOrders, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_amount, status, created_at');

      if (ordersError) throw ordersError;

      const orders = allOrders || [];

      // Calculer les statistiques
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const processingOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'shipped').length;
      const completedOrders = orders.filter(o => o.status === 'delivered').length;
      const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);

      const todayOrders = orders.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate >= startOfToday && orderDate <= endOfToday;
      }).length;

      const monthlyOrders = orders.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate >= startOfMonth;
      }).length;

      const yearlyOrders = orders.filter(o => {
        const orderDate = new Date(o.created_at);
        return orderDate >= startOfYear;
      }).length;

      return {
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        totalRevenue,
        todayOrders,
        monthlyOrders,
        yearlyOrders,
      };
    },
  });

  const { data: recentOrders, isLoading: recentOrdersLoading } = useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: async (): Promise<RecentOrder[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, order_number, customer_name, total_amount, status, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
  });

  const { data: topProducts, isLoading: topProductsLoading } = useQuery({
    queryKey: ['admin-top-products'],
    queryFn: async (): Promise<TopProduct[]> => {
      const { data, error } = await supabase
        .from('order_items')
        .select('product_name, quantity, total_price')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Grouper par produit et calculer les totaux
      const productMap = new Map<string, TopProduct>();
      
      (data || []).forEach(item => {
        const existing = productMap.get(item.product_name);
        if (existing) {
          existing.total_quantity += item.quantity;
          existing.total_revenue += Number(item.total_price);
          existing.order_count += 1;
        } else {
          productMap.set(item.product_name, {
            product_name: item.product_name,
            total_quantity: item.quantity,
            total_revenue: Number(item.total_price),
            order_count: 1,
          });
        }
      });

      return Array.from(productMap.values())
        .sort((a, b) => b.total_quantity - a.total_quantity)
        .slice(0, 10);
    },
  });

  return {
    stats,
    recentOrders,
    topProducts,
    isLoading: statsLoading || recentOrdersLoading || topProductsLoading,
  };
};
