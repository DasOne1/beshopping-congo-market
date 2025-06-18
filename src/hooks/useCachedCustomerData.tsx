
import { useQuery } from '@tanstack/react-query';
import { usePhoneAuth } from '@/hooks/usePhoneAuth';

export const useCachedCustomerData = () => {
  const { currentCustomer, isAuthenticated } = usePhoneAuth();

  const { data: customerData, isLoading } = useQuery({
    queryKey: ['customer-data', currentCustomer?.id],
    queryFn: async () => {
      // Retourner directement les données du contexte d'authentification
      // qui sont déjà mises en cache dans localStorage
      return currentCustomer;
    },
    enabled: !!currentCustomer && isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
    initialData: currentCustomer,
  });

  return {
    customerData,
    isLoading: isLoading && !currentCustomer,
    isAuthenticated,
  };
};
