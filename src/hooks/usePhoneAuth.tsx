
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import bcrypt from 'bcryptjs';

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: any;
  created_at?: string;
  updated_at?: string;
  last_order_date?: string;
  orders_count?: number;
  total_spent?: number;
  status?: string;
  password_hash?: string;
}

interface SignUpData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  password: string;
}

export const usePhoneAuth = () => {
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() => {
    const customerId = localStorage.getItem('customer_id');
    const sessionToken = localStorage.getItem('customer_session_token');
    const customerData = localStorage.getItem('customer_data');
    if (customerId && sessionToken && customerData) {
      return JSON.parse(customerData);
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('customer_session_token');
  });

  useEffect(() => {
    const verifySession = async () => {
      const sessionToken = localStorage.getItem('customer_session_token');
      const customerId = localStorage.getItem('customer_id');
      
      if (!sessionToken || !customerId) {
        return;
      }

      try {
        if (!navigator.onLine) {
          const cachedData = localStorage.getItem('customer_data');
          if (cachedData) {
            setCurrentCustomer(JSON.parse(cachedData));
            setIsAuthenticated(true);
            return;
          }
        }

        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', customerId)
          .single();

        if (!customerError && customerData) {
          setCurrentCustomer(customerData);
          setIsAuthenticated(true);
          localStorage.setItem('customer_data', JSON.stringify(customerData));
        } else {
          localStorage.removeItem('customer_session_token');
          localStorage.removeItem('customer_id');
          localStorage.removeItem('customer_data');
          setCurrentCustomer(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de session:', error);
        const cachedData = localStorage.getItem('customer_data');
        if (cachedData) {
          setCurrentCustomer(JSON.parse(cachedData));
          setIsAuthenticated(true);
        }
      }
    };

    verifySession();

    const handleOnline = () => {
      verifySession();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const generateSessionToken = useCallback(() => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomStr}`;
  }, []);

  const signUp = async (data: SignUpData) => {
    setLoading(true);
    try {
      // Vérifier si le numéro de téléphone existe déjà
      const [existingAuthResult, hashedPassword] = await Promise.all([
        supabase
          .from('customer_auth')
          .select('email')
          .eq('email', data.phone)
          .maybeSingle(),
        bcrypt.hash(data.password, 12)
      ]);

      if (existingAuthResult.data) {
        throw new Error('Un compte avec ce numéro de téléphone existe déjà');
      }

      // Créer le client et l'authentification
      const [customerResult, authResult] = await Promise.all([
        supabase
          .from('customers')
          .insert([{
            name: data.name,
            phone: data.phone,
            email: data.email || null,
            address: data.address ? { address: data.address } : null
          }])
          .select()
          .single(),
        supabase
          .from('customer_auth')
          .insert([{
            customer_id: null,
            email: data.phone, // Utiliser le téléphone comme identifiant
            password_hash: hashedPassword,
            email_verified: true
          }])
          .select()
          .single()
      ]);

      if (customerResult.error) throw customerResult.error;
      if (authResult.error) throw authResult.error;

      // Lier l'authentification au client
      await supabase
        .from('customer_auth')
        .update({ customer_id: customerResult.data.id })
        .eq('id', authResult.data.id);

      const sessionToken = generateSessionToken();
      localStorage.setItem('customer_session_token', sessionToken);
      localStorage.setItem('customer_id', customerResult.data.id);
      localStorage.setItem('customer_data', JSON.stringify(customerResult.data));
      setCurrentCustomer(customerResult.data);
      setIsAuthenticated(true);

      toast({
        title: "Compte créé avec succès",
        description: "Votre compte a été créé et vous êtes maintenant connecté.",
      });

    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur est survenue lors de la création du compte",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (phone: string, password: string) => {
    setLoading(true);
    try {
      // Rechercher par numéro de téléphone dans customer_auth
      const [authResult, customerResult] = await Promise.all([
        supabase
          .from('customer_auth')
          .select('*')
          .eq('email', phone) // email stocke le numéro de téléphone
          .single(),
        supabase
          .from('customers')
          .select('*')
          .eq('phone', phone)
          .single()
      ]);

      if (authResult.error || !authResult.data) {
        throw new Error('Numéro de téléphone ou mot de passe incorrect');
      }

      const isPasswordValid = await bcrypt.compare(password, authResult.data.password_hash);
      if (!isPasswordValid) {
        throw new Error('Numéro de téléphone ou mot de passe incorrect');
      }

      if (customerResult.error || !customerResult.data) {
        throw new Error('Données client introuvables');
      }

      const sessionToken = generateSessionToken();
      localStorage.setItem('customer_session_token', sessionToken);
      localStorage.setItem('customer_id', customerResult.data.id);
      localStorage.setItem('customer_data', JSON.stringify(customerResult.data));
      setCurrentCustomer(customerResult.data);
      setIsAuthenticated(true);

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });

    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = useCallback(async () => {
    try {
      localStorage.removeItem('customer_session_token');
      localStorage.removeItem('customer_id');
      localStorage.removeItem('customer_data');
      setCurrentCustomer(null);
      setIsAuthenticated(false);

      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }, []);

  const updateProfile = async (data: Partial<Customer>) => {
    if (!currentCustomer) return;
    
    setLoading(true);
    try {
      const { password_hash, orders_count, total_spent, last_order_date, ...updateData } = data;

      const { data: updatedCustomer, error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', currentCustomer.id)
        .select()
        .single();

      if (error) throw error;

      setCurrentCustomer(updatedCustomer);
      localStorage.setItem('customer_data', JSON.stringify(updatedCustomer));
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de mettre à jour le profil.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    currentCustomer,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    updateProfile
  };
};
