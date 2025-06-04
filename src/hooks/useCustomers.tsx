import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { PostgrestError } from '@supabase/supabase-js';

// Type pour l'adresse
type Address = {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
};

// Schéma de validation pour les données client
const customerSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().min(10, 'Numéro de téléphone invalide').optional().or(z.literal('')),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postal_code: z.string().optional(),
  }).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: Address;
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
    retry: 1,
    retryDelay: 500,
    refetchOnWindowFocus: false,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: false, // Désactiver l'actualisation automatique
  });

  const createCustomer = useMutation({
    mutationFn: async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        // Valider les données
        const validatedData = customerSchema.parse(customer);

        // Vérifier si le client existe déjà
        const { data: existingCustomers, error: searchError } = await supabase
          .from('customers')
          .select('*')
          .or(`phone.eq.${validatedData.phone},email.eq.${validatedData.email}`)
          .limit(1);

        if (searchError) throw searchError;

        if (existingCustomers && existingCustomers.length > 0) {
          const existingCustomer = existingCustomers[0];
          if (existingCustomer.phone === validatedData.phone) {
            throw new Error('Un client avec ce numéro de téléphone existe déjà');
          }
          if (existingCustomer.email === validatedData.email) {
            throw new Error('Un client avec cet email existe déjà');
          }
        }

        // Créer le nouveau client
        const newCustomer = {
          name: validatedData.name,
          email: validatedData.email,
          phone: validatedData.phone,
          address: validatedData.address,
          total_spent: 0,
          orders_count: 0,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('customers')
          .insert([newCustomer])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(error.errors[0].message);
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Client créé",
        description: "Le client a été créé avec succès",
      });
    },
    onError: (error: Error | PostgrestError) => {
      console.error('Erreur lors de la création du client:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la création du client",
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
    onError: (error: Error | PostgrestError) => {
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
      try {
        // Valider les données de mise à jour
        const validatedData = customerSchema.partial().parse(updates);

        // Vérifier si le client existe
        const { data: existingCustomer, error: fetchError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw new Error('Client non trouvé');

        // Vérifier les doublons si le téléphone ou l'email est modifié
        if (validatedData.phone || validatedData.email) {
          const { data: duplicates, error: searchError } = await supabase
            .from('customers')
            .select('*')
            .or(`phone.eq.${validatedData.phone},email.eq.${validatedData.email}`)
            .neq('id', id)
            .limit(1);

          if (searchError) throw searchError;

          if (duplicates && duplicates.length > 0) {
            const duplicate = duplicates[0];
            if (duplicate.phone === validatedData.phone) {
              throw new Error('Un autre client utilise déjà ce numéro de téléphone');
            }
            if (duplicate.email === validatedData.email) {
              throw new Error('Un autre client utilise déjà cet email');
            }
          }
        }

        // Mettre à jour le client
        const updateData = {
          ...validatedData,
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('customers')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(error.errors[0].message);
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({
        title: "Client mis à jour",
        description: "Le client a été mis à jour avec succès",
      });
    },
    onError: (error: Error | PostgrestError) => {
      console.error('Erreur lors de la mise à jour du client:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la mise à jour du client",
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
    onError: (error: Error | PostgrestError) => {
      console.error('Erreur lors de la suppression du client:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la suppression du client",
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
