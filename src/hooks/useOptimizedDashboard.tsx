
import { useOptimizedDashboard } from './useOptimizedData';
import { useGlobalStore } from '@/store/useGlobalStore';

export const useAdminDashboard = () => {
  const { stats, isLoading, refetch } = useOptimizedDashboard();
  
  // Calculer les commandes récentes et produits populaires à partir du store
  const { orders, products } = useGlobalStore();
  
  const recentOrders = orders
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)
    .map(order => ({
      id: order.id,
      order_number: order.order_number || `ORD-${order.id.slice(0, 8)}`,
      customer_name: order.customer_name,
      total_amount: order.total_amount,
      status: order.status,
      created_at: order.created_at,
    }));

  const topProducts = products
    .filter(p => p.status === 'active')
    .sort((a, b) => (b.popular || 0) - (a.popular || 0))
    .slice(0, 10)
    .map(product => ({
      product_name: product.name,
      total_quantity: product.popular || 0,
      total_revenue: product.original_price * (product.popular || 0),
      order_count: product.popular || 0,
    }));

  return {
    stats,
    recentOrders,
    topProducts,
    isLoading,
    refetch,
  };
};
