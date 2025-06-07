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
  email: string;
  phone?: string;
  address?: string;
  password: string;
}

export const useEmailAuth = () => {
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() => {
    // Initialiser l'état avec les données du localStorage si disponibles
    const customerId = localStorage.getItem('customer_id');
    const sessionToken = localStorage.getItem('customer_session_token');
    if (customerId && sessionToken) {
      return JSON.parse(localStorage.getItem('customer_data') || 'null');
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialiser l'état d'authentification avec les données du localStorage
    return !!localStorage.getItem('customer_session_token');
  });

  // Vérifier la session au chargement
  useEffect(() => {
    const verifySession = async () => {
      const sessionToken = localStorage.getItem('customer_session_token');
      const customerId = localStorage.getItem('customer_id');
      
      if (!sessionToken || !customerId) {
        return;
      }

      try {
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', customerId)
          .single();

        if (!customerError && customerData) {
          setCurrentCustomer(customerData);
          setIsAuthenticated(true);
          // Mettre à jour les données en cache
          localStorage.setItem('customer_data', JSON.stringify(customerData));
        } else {
          // Si les données ne sont pas valides, nettoyer le localStorage
          localStorage.removeItem('customer_session_token');
          localStorage.removeItem('customer_id');
          localStorage.removeItem('customer_data');
          setCurrentCustomer(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de session:', error);
      }
    };

    verifySession();
  }, []);

  const generateSessionToken = useCallback(() => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomStr}`;
  }, []);

  const signUp = async (data: SignUpData) => {
    setLoading(true);
    try {
      const [existingAuthResult, hashedPassword] = await Promise.all([
        supabase
          .from('customer_auth')
          .select('email')
          .eq('email', data.email)
          .maybeSingle(),
        bcrypt.hash(data.password, 12)
      ]);

      if (existingAuthResult.data) {
        throw new Error('Un compte avec cet email existe déjà');
      }

      const [customerResult, authResult] = await Promise.all([
        supabase
          .from('customers')
          .insert([{
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            address: data.address ? { address: data.address } : null
          }])
          .select()
          .single(),
        supabase
          .from('customer_auth')
          .insert([{
            customer_id: null,
            email: data.email,
            password_hash: hashedPassword,
            email_verified: true
          }])
          .select()
          .single()
      ]);

      if (customerResult.error) throw customerResult.error;
      if (authResult.error) throw authResult.error;

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

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const [authResult, customerResult] = await Promise.all([
        supabase
          .from('customer_auth')
          .select('*')
          .eq('email', email)
          .single(),
        supabase
          .from('customers')
          .select('*')
          .eq('email', email)
          .single()
      ]);

      if (authResult.error || !authResult.data) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const isPasswordValid = await bcrypt.compare(password, authResult.data.password_hash);
      if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect');
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
