
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface AppSettings {
  id: string;
  company_name: string;
  company_description?: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  company_logo?: string;
  currency: string;
  tax_rate: number;
  shipping_cost: number;
  free_shipping_threshold?: number;
  enable_whatsapp: boolean;
  whatsapp_number?: string;
  enable_email_notifications: boolean;
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string;
  created_at?: string;
  updated_at?: string;
}

export const useAppSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['app-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data as AppSettings;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (updates: Partial<AppSettings>) => {
      const { data, error } = await supabase
        .from('app_settings')
        .update(updates)
        .eq('id', settings?.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['app-settings'] });
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres de l'application ont été mis à jour avec succès",
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
    settings,
    isLoading,
    updateSettings,
  };
};
