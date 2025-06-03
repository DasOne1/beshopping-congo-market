/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';

interface CustomerData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  password: string;
}

interface LoginData {
  phone: string;
  password: string;
}

export const useCustomerAuth = () => {
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Charger l'état de connexion au démarrage
  useEffect(() => {
    const loadAuthState = async () => {
      const savedCustomerId = localStorage.getItem('customerId');
      const savedCustomerData = localStorage.getItem('customerData');
      
      if (savedCustomerId && savedCustomerData) {
        try {
          // En mode hors ligne, utiliser les données stockées
          if (!navigator.onLine) {
            const customerData = JSON.parse(savedCustomerData);
            setCurrentCustomer(customerData);
            setIsAuthenticated(true);
            return;
          }

          // En mode en ligne, vérifier avec Supabase
          const { data: customer, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', savedCustomerId)
            .single();

          if (customer && !error) {
            setCurrentCustomer(customer);
            setIsAuthenticated(true);
            // Mettre à jour les données stockées
            localStorage.setItem('customerData', JSON.stringify(customer));
          } else {
            // Si le client n'existe plus, nettoyer le localStorage
            localStorage.removeItem('customerId');
            localStorage.removeItem('customerData');
          }
        } catch (error) {
          console.error('Erreur lors du chargement de l\'état de connexion:', error);
          // En cas d'erreur, utiliser les données stockées si disponibles
          if (savedCustomerData) {
            const customerData = JSON.parse(savedCustomerData);
            setCurrentCustomer(customerData);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('customerId');
            localStorage.removeItem('customerData');
          }
        }
      }
    };

    loadAuthState();
  }, []);

  const signUp = async (customerData: CustomerData) => {
    setLoading(true);
    try {
      console.log('Création du compte client...');
      
      // Vérifier si le numéro de téléphone existe déjà
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('phone')
        .eq('phone', customerData.phone)
        .maybeSingle();

      if (existingCustomer) {
        throw new Error('Ce numéro de téléphone est déjà utilisé');
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(customerData.password, 10);

      // Créer le customer avec le mot de passe hashé
      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert({
          name: customerData.name,
          phone: customerData.phone,
          email: customerData.email || null,
          address: customerData.address || null,
          password_hash: hashedPassword,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création du compte:', error);
        throw new Error('Erreur lors de la création du compte');
      }

      console.log('Compte créé avec succès:', newCustomer);
      
      // Connecter automatiquement l'utilisateur après création
      setCurrentCustomer(newCustomer);
      setIsAuthenticated(true);
      localStorage.setItem('customerId', newCustomer.id);
      localStorage.setItem('customerData', JSON.stringify(newCustomer));
      
      toast({
        title: "Compte créé avec succès",
        description: "Bienvenue !",
      });

      return newCustomer;
    } catch (error: any) {
      console.error('Erreur de création de compte:', error);
      toast({
        title: "Erreur de création de compte",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (loginData: LoginData) => {
    setLoading(true);
    try {
      console.log('Connexion du client...');
      
      // Chercher le customer par numéro de téléphone avec password_hash
      const { data: customer, error } = await supabase
        .from('customers')
        .select('*, password_hash')
        .eq('phone', loginData.phone)
        .maybeSingle();

      if (error || !customer) {
        throw new Error('Numéro de téléphone ou mot de passe incorrect');
      }

      // Vérifier si le customer a un mot de passe
      if (!customer.password_hash) {
        throw new Error('Aucun mot de passe défini pour ce compte');
      }

      // Vérifier le mot de passe
      const passwordMatch = await bcrypt.compare(loginData.password, customer.password_hash);
      
      if (!passwordMatch) {
        throw new Error('Numéro de téléphone ou mot de passe incorrect');
      }

      console.log('Connexion réussie:', customer);
      
      setCurrentCustomer(customer);
      setIsAuthenticated(true);
      localStorage.setItem('customerId', customer.id);
      localStorage.setItem('customerData', JSON.stringify(customer));
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });

      return customer;
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
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerData');
    
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
  };

  const updateProfile = async (customerData: Partial<CustomerData>) => {
    if (!currentCustomer) throw new Error('Aucun utilisateur connecté');
    
    setLoading(true);
    try {
      let updateData: any = { ...customerData };
      
      // Si un nouveau mot de passe est fourni, le hasher
      if (customerData.password) {
        updateData.password_hash = await bcrypt.hash(customerData.password, 10);
        delete updateData.password;
      }

      const { data: updatedCustomer, error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', currentCustomer.id)
        .select()
        .single();

      if (error) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }
      
      setCurrentCustomer(updatedCustomer);
      localStorage.setItem('customerData', JSON.stringify(updatedCustomer));
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées",
      });

      return updatedCustomer;
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
