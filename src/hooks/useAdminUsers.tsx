import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { AdminProfile } from './useAdminAuth';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdminCreationData = any;

async function fetchAdminUsers(): Promise<AdminProfile[]> {
  const { data, error } = await supabase
    .from('admin_profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admin users:', error);
    throw new Error(error.message);
  }
  return data || [];
}

async function createAdminUser(userData: AdminCreationData) {
  const { data: { session } } = await supabase.auth.getSession();

  const headers: { [key: string]: string } = {};
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const response = await supabase.functions.invoke('create-admin-user', {
    body: userData,
    headers,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (response.data.error) {
    throw new Error(response.data.error);
  }

  return response.data;
}

export function useAdminUsers() {
  const queryClient = useQueryClient();

  const { data: adminUsers, isLoading, isError } = useQuery<AdminProfile[]>({
    queryKey: ['adminUsers'],
    queryFn: fetchAdminUsers,
  });

  const createMutation = useMutation({
    mutationFn: createAdminUser,
    onSuccess: () => {
      toast({
        title: 'Utilisateur créé',
        description: 'Le nouvel utilisateur administrateur a été créé avec succès.',
      });
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erreur de création',
        description: error.message || 'Une erreur est survenue.',
        variant: 'destructive',
      });
    },
  });

  return {
    adminUsers,
    isLoading,
    isError,
    createAdminUser: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}
