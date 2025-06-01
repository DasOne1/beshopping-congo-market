
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useCustomers } from './useCustomers';

interface CustomerAuthData {
  phone: string;
  password: string;
}

interface CustomerData {
  name: string;
  email?: string;
  phone?: string;
  address?: any;
}

export const useCustomerAuth = () => {
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createCustomer, updateCustomer } = useCustomers();

  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const signUp = async (customerData: CustomerData, password: string) => {
    if (!customerData.phone) {
      throw new Error('Le numéro de téléphone est requis');
    }

    setLoading(true);
    try {
      // Créer ou récupérer le customer
      const customer = await createCustomer.mutateAsync(customerData);
      
      // Hasher le mot de passe
      const passwordHash = await hashPassword(password);
      
      // Créer l'authentification
      const { error } = await supabase
        .from('customer_auth')
        .insert({
          customer_id: customer.id,
          phone: customerData.phone,
          password_hash: passwordHash
        });

      if (error) throw error;

      setCurrentCustomer(customer);
      setIsAuthenticated(true);
      
      toast({
        title: "Compte créé avec succès",
        description: "Vous êtes maintenant connecté",
      });
    } catch (error: any) {
      toast({
        title: "Erreur lors de la création du compte",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async ({ phone, password }: CustomerAuthData) => {
    setLoading(true);
    try {
      const passwordHash = await hashPassword(password);
      
      console.log('Tentative de connexion avec:', { phone, passwordHash });
      
      // Récupérer les données d'authentification - utiliser .maybeSingle() au lieu de .single()
      const { data: authData, error: authError } = await supabase
        .from('customer_auth')
        .select('customer_id')
        .eq('phone', phone)
        .eq('password_hash', passwordHash)
        .maybeSingle();

      console.log('Résultat auth:', { authData, authError });

      if (authError) {
        console.error('Erreur auth:', authError);
        throw new Error('Erreur lors de la vérification des identifiants');
      }

      if (!authData) {
        throw new Error('Téléphone ou mot de passe incorrect');
      }

      // Récupérer les données du customer
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', authData.customer_id)
        .maybeSingle();

      console.log('Résultat customer:', { customerData, customerError });

      if (customerError) {
        console.error('Erreur customer:', customerError);
        throw new Error('Erreur lors de la récupération des données utilisateur');
      }

      if (!customerData) {
        throw new Error('Utilisateur introuvable');
      }

      setCurrentCustomer(customerData);
      setIsAuthenticated(true);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });
    } catch (error: any) {
      console.error('Erreur de connexion complète:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setCurrentCustomer(null);
    setIsAuthenticated(false);
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
  };

  const updateProfile = async (customerData: Partial<CustomerData>) => {
    if (!currentCustomer) throw new Error('Aucun utilisateur connecté');
    
    setLoading(true);
    try {
      const updatedCustomer = await updateCustomer.mutateAsync({
        id: currentCustomer.id,
        ...customerData
      });
      
      setCurrentCustomer(updatedCustomer);
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées",
      });
    } catch (error: any) {
      toast({
        title: "Erreur lors de la mise à jour",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentCustomer,
    isAuthenticated,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };
};
