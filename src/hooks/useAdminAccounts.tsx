
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AdminAccount {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export const useAdminAccounts = () => {
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error: any) {
      console.error('Error fetching admin accounts:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les comptes administrateurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAccount = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            is_admin: 'true',
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Compte créé",
        description: "Le compte administrateur a été créé avec succès",
      });

      await fetchAccounts();
      return { success: true };
    } catch (error: any) {
      console.error('Error creating admin account:', error);
      toast({
        title: "Erreur de création",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const updateAccount = async (id: string, updates: Partial<AdminAccount>) => {
    try {
      const { error } = await supabase
        .from('admin_profiles')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Compte mis à jour",
        description: "Les informations ont été mises à jour avec succès",
      });

      await fetchAccounts();
      return { success: true };
    } catch (error: any) {
      console.error('Error updating admin account:', error);
      toast({
        title: "Erreur de mise à jour",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const deleteAccount = async (id: string, userId: string) => {
    try {
      // D'abord supprimer le profil admin
      const { error: profileError } = await supabase
        .from('admin_profiles')
        .delete()
        .eq('id', id);

      if (profileError) throw profileError;

      // Ensuite supprimer l'utilisateur auth (via une fonction RPC si disponible)
      // Note: La suppression d'utilisateur auth nécessite des privilèges spéciaux
      
      toast({
        title: "Compte supprimé",
        description: "Le compte administrateur a été supprimé avec succès",
      });

      await fetchAccounts();
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting admin account:', error);
      toast({
        title: "Erreur de suppression",
        description: error.message,
        variant: "destructive",
      });
      return { success: false, error: error.message };
    }
  };

  const toggleAccountStatus = async (id: string, currentStatus: boolean) => {
    return updateAccount(id, { is_active: !currentStatus });
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return {
    accounts,
    loading,
    fetchAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
    toggleAccountStatus,
  };
};
