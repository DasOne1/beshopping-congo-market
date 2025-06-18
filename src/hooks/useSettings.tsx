
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface AppSettings {
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: {
    street: string;
    city: string;
    country: string;
  };
  currency: string;
  tax_rate: number;
  shipping_fee: number;
  free_shipping_threshold: number;
  site_url?: string;
  site_description?: string;
  language?: string;
  timezone?: string;
  enable_order_confirmation?: boolean;
  enable_shipment_notification?: boolean;
  enable_newsletter?: boolean;
  enable_2fa?: boolean;
  enable_login_logging?: boolean;
  enable_auto_logout?: boolean;
  theme?: 'light' | 'dark' | 'auto';
  primary_color?: string;
  logo_url?: string;
  favicon_url?: string;
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
        try {
          settingsObj[setting.key] = JSON.parse(setting.value as any);
        } catch (e) {
          settingsObj[setting.key] = setting.value;
        }
      });

      return settingsObj as AppSettings;
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      // D'abord vérifier si la clé existe déjà
      const { data: existingSetting } = await supabase
        .from('settings')
        .select('id')
        .eq('key', key)
        .single();

      const valueToStore = JSON.stringify(value);

      if (existingSetting) {
        // Mettre à jour le setting existant
        const { data, error } = await supabase
          .from('settings')
          .update({
            value: valueToStore,
            updated_at: new Date().toISOString()
          })
          .eq('key', key)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Créer un nouveau setting
        const { data, error } = await supabase
          .from('settings')
          .insert({
            key,
            value: valueToStore,
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      // Ne pas afficher de toast ici car on le fait après la sauvegarde de tous les paramètres.
    },
    onError: (error: any) => {
      console.error('Error updating setting:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour du paramètre",
        variant: "destructive",
      });
    },
  });

  return {
    settings: settings || {
      company_name: 'BeShopping',
      company_email: 'contact@beshopping.com',
      company_phone: '+243 974 984 449',
      company_address: { street: 'Av. des Cliniques', city: 'Lubumbasi', country: 'RDC' },
      currency: 'CDF',
      tax_rate: 0,
      shipping_fee: 5000,
      free_shipping_threshold: 50000,
      site_url: 'https://beshopping.com',
      site_description: 'Votre boutique en ligne de confiance',
      language: 'fr',
      timezone: 'Africa/Lubumbasi',
      enable_order_confirmation: true,
      enable_shipment_notification: true,
      enable_newsletter: false,
      enable_2fa: false,
      enable_login_logging: true,
      enable_auto_logout: true,
      theme: 'light',
      primary_color: '#3b82f6',
      logo_url: '',
      favicon_url: '',
    },
    isLoading,
    updateSetting,
  };
};
