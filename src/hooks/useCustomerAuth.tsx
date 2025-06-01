
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
      console.log('Création du compte avec téléphone:', customerData.phone);
      
      // Vérifier si un compte avec ce téléphone existe déjà
      const { data: existingAuth, error: checkError } = await supabase
        .from('customer_auth')
        .select('phone')
        .eq('phone', customerData.phone)
        .maybeSingle();

      if (checkError) {
        console.error('Erreur lors de la vérification:', checkError);
        throw new Error('Erreur lors de la vérification du compte');
      }

      if (existingAuth) {
        throw new Error('Un compte avec ce numéro de téléphone existe déjà');
      }

      // Créer ou récupérer le customer
      const customer = await createCustomer.mutateAsync(customerData);
      console.log('Customer créé:', customer);
      
      // Hasher le mot de passe
      const passwordHash = await hashPassword(password);
      console.log('Mot de passe hashé pour création');
      
      // Créer l'authentification
      const { error } = await supabase
        .from('customer_auth')
        .insert({
          customer_id: customer.id,
          phone: customerData.phone,
          password_hash: passwordHash
        });

      if (error) {
        console.error('Erreur lors de la création de l\'auth:', error);
        throw error;
      }

      console.log('Authentification créée avec succès');
      setCurrentCustomer(customer);
      setIsAuthenticated(true);
      
      toast({
        title: "Compte créé avec succès",
        description: "Vous êtes maintenant connecté",
      });
    } catch (error: any) {
      console.error('Erreur complète lors de la création:', error);
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
      console.log('Tentative de connexion avec téléphone:', phone);
      
      // Hasher le mot de passe de la même façon qu'à la création
      const passwordHash = await hashPassword(password);
      console.log('Mot de passe hashé pour connexion');
      
      // Récupérer les données d'authentification avec jointure sur customers
      const { data: authData, error: authError } = await supabase
        .from('customer_auth')
        .select(`
          customer_id,
          customers!inner(*)
        `)
        .eq('phone', phone)
        .eq('password_hash', passwordHash)
        .maybeSingle();

      console.log('Résultat de la requête auth:', { authData, authError });

      if (authError) {
        console.error('Erreur lors de la requête auth:', authError);
        throw new Error('Erreur lors de la vérification des identifiants');
      }

      if (!authData) {
        console.log('Aucune correspondance trouvée pour:', { phone, passwordHash });
        throw new Error('Téléphone ou mot de passe incorrect');
      }

      console.log('Connexion réussie, données customer:', authData.customers);
      
      setCurrentCustomer(authData.customers);
      setIsAuthenticated(true);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
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
