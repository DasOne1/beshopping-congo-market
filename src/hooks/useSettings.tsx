
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface AppSettings {
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: any;
  currency: string;
  tax_rate: number;
  shipping_fee: number;
  free_shipping_threshold: number;
}

export const useSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*');

      if (error) throw error;

      // Transform settings array into object
      const settingsObj: any = {};
      data?.forEach(setting => {
        settingsObj[setting.key] = typeof setting.value === 'string' 
          ? JSON.parse(setting.value) 
          : setting.value;
      });

      return settingsObj as AppSettings;
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      const { data, error } = await supabase
        .from('settings')
        .upsert({
          key,
          value: JSON.stringify(value),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast({
        title: "Paramètre mis à jour",
        description: "Le paramètre a été mis à jour avec succès",
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
    settings: settings || {
      company_name: 'BeShopping',
      company_email: 'contact@beshopping.com',
      company_phone: '+243123456789',
      company_address: { street: 'Av. des Cliniques', city: 'Kinshasa', country: 'RDC' },
      currency: 'CDF',
      tax_rate: 0,
      shipping_fee: 5000,
      free_shipping_threshold: 50000,
    },
    isLoading,
    updateSetting,
  };
};
