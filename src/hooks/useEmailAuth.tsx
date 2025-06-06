/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
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
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier la session au chargement
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const sessionToken = localStorage.getItem('customer_session_token');
      if (!sessionToken) {
        return;
      }

      // Pour l'instant, on simule une vérification de session
      // En attendant que la table customer_sessions soit créée
      console.log('Session token trouvé:', sessionToken);
      
      // Récupérer l'ID du client depuis le token stocké
      const customerId = localStorage.getItem('customer_id');
      if (!customerId) {
        localStorage.removeItem('customer_session_token');
        return;
      }

      // Récupérer les données du client
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();

      if (!customerError && customerData) {
        setCurrentCustomer(customerData);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('customer_session_token');
        localStorage.removeItem('customer_id');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de session:', error);
      localStorage.removeItem('customer_session_token');
      localStorage.removeItem('customer_id');
    }
  };

  const generateSessionToken = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${randomStr}`;
  };

  const signUp = async (data: SignUpData) => {
    setLoading(true);
    try {
      // Vérifier si l'email existe déjà
      const { data: existingAuth, error: checkError } = await supabase
        .from('customer_auth')
        .select('email')
        .eq('email', data.email)
        .maybeSingle();

      if (existingAuth) {
        throw new Error('Un compte avec cet email existe déjà');
      }

      // Hacher le mot de passe
      const hashedPassword = await bcrypt.hash(data.password, 12);

      // Créer le client
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          address: data.address ? { address: data.address } : null
        }])
        .select()
        .single();

      if (customerError) throw customerError;

      // Créer l'authentification
      const { data: authData, error: authError } = await supabase
        .from('customer_auth')
        .insert([{
          customer_id: customer.id,
          email: data.email,
          password_hash: hashedPassword,
          email_verified: true
        }])
        .select()
        .single();

      if (authError) {
        // Supprimer le client si l'auth échoue
        await supabase.from('customers').delete().eq('id', customer.id);
        throw authError;
      }

      // Créer une session (temporairement en localStorage)
      const sessionToken = generateSessionToken();
      localStorage.setItem('customer_session_token', sessionToken);
      localStorage.setItem('customer_id', customer.id);
      setCurrentCustomer(customer);
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
      // Récupérer les données d'authentification
      const { data: authData, error: authError } = await supabase
        .from('customer_auth')
        .select('*')
        .eq('email', email)
        .single();

      if (authError || !authData) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, authData.password_hash);
      if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Récupérer les données du client
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', authData.customer_id)
        .single();

      if (customerError || !customer) {
        throw new Error('Données client introuvables');
      }

      // Créer une session (temporairement en localStorage)
      const sessionToken = generateSessionToken();
      localStorage.setItem('customer_session_token', sessionToken);
      localStorage.setItem('customer_id', customer.id);
      setCurrentCustomer(customer);
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

  const signOut = async () => {
    try {
      localStorage.removeItem('customer_session_token');
      localStorage.removeItem('customer_id');
      setCurrentCustomer(null);
      setIsAuthenticated(false);

      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const updateProfile = async (data: Partial<Customer>) => {
    if (!currentCustomer) return;
    
    setLoading(true);
    try {
      // Ne pas inclure les champs sensibles ou calculés
      const { password_hash, orders_count, total_spent, last_order_date, ...updateData } = data;

      const { data: updatedCustomer, error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', currentCustomer.id)
        .select()
        .single();

      if (error) throw error;

      setCurrentCustomer(updatedCustomer);
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
    updateProfile,
    checkSession
  };
};
