
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
      // For now, return default settings since app_settings table structure is different
      // We'll create a proper settings management later
      const defaultSettings: AppSettings = {
        id: '1',
        company_name: 'BeShop',
        company_description: 'Votre boutique en ligne moderne',
        company_address: 'Kinshasa, RDC',
        company_phone: '+243 978 100 940',
        company_email: 'contact@beshop.com',
        company_logo: '',
        currency: 'CDF',
        tax_rate: 0,
        shipping_cost: 0,
        free_shipping_threshold: 50000,
        enable_whatsapp: true,
        whatsapp_number: '243978100940',
        enable_email_notifications: false,
        smtp_host: '',
        smtp_port: 587,
        smtp_username: '',
        smtp_password: '',
      };
      
      return defaultSettings;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (updates: Partial<AppSettings>) => {
      // For now, just return the updated settings
      // Later we'll implement proper database storage
      return { ...settings, ...updates };
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
