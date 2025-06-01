
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useCustomers } from './useCustomers';

interface CustomerData {
  name: string;
  phone?: string;
  address?: string;
}

export const useCustomerAuth = () => {
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createCustomer, updateCustomer } = useCustomers();

  const signInWithGoogle = async (customerData?: CustomerData) => {
    setLoading(true);
    try {
      console.log('Connexion avec Google...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/account`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        console.error('Erreur lors de la connexion Google:', error);
        throw new Error('Erreur lors de la connexion avec Google');
      }

      // Si des données client sont fournies, les stocker temporairement
      if (customerData) {
        localStorage.setItem('pendingCustomerData', JSON.stringify(customerData));
      }

      toast({
        title: "Redirection vers Google",
        description: "Vous allez être redirigé vers Google pour vous connecter",
      });
    } catch (error: any) {
      console.error('Erreur de connexion Google:', error);
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

  const handleGoogleAuthCallback = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        return;
      }

      if (session?.user) {
        console.log('Utilisateur connecté:', session.user);
        
        // Récupérer les données client en attente
        const pendingData = localStorage.getItem('pendingCustomerData');
        let customerData: CustomerData = {
          name: session.user.user_metadata.full_name || session.user.email || 'Utilisateur',
          phone: '',
          address: ''
        };

        if (pendingData) {
          const parsedData = JSON.parse(pendingData);
          customerData = { ...customerData, ...parsedData };
          localStorage.removeItem('pendingCustomerData');
        }

        // Créer ou récupérer le customer
        let customer;
        try {
          // Chercher un customer existant avec cet email
          const existingCustomer = await supabase
            .from('customers')
            .select('*')
            .eq('email', session.user.email)
            .maybeSingle();

          if (existingCustomer.data) {
            customer = existingCustomer.data;
            console.log('Customer existant trouvé:', customer);
          } else {
            // Créer un nouveau customer
            customer = await createCustomer.mutateAsync({
              ...customerData,
              email: session.user.email,
            });
            console.log('Nouveau customer créé:', customer);
          }
        } catch (createError) {
          console.error('Erreur lors de la création du customer:', createError);
          // Utiliser les données de session comme fallback
          customer = {
            id: session.user.id,
            name: customerData.name,
            email: session.user.email,
            phone: customerData.phone,
            address: customerData.address
          };
        }

        setCurrentCustomer(customer);
        setIsAuthenticated(true);
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue !",
        });
      }
    } catch (error) {
      console.error('Erreur lors du callback Google:', error);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentCustomer(null);
      setIsAuthenticated(false);
      localStorage.removeItem('pendingCustomerData');
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
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
    signInWithGoogle,
    signOut,
    updateProfile,
    handleGoogleAuthCallback,
  };
};
