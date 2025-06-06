
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
}

interface CustomerAuthData {
  id: string;
  customer_id: string;
  email: string;
  password_hash: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
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

      // Vérifier le token via notre fonction personnalisée
      const { data, error } = await supabase.rpc('verify_session_token', {
        token: sessionToken
      });

      if (error) {
        console.error('Erreur lors de la vérification de session:', error);
        localStorage.removeItem('customer_session_token');
        return;
      }

      if (data) {
        // Récupérer les données du client
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', data)
          .single();

        if (!customerError && customerData) {
          setCurrentCustomer(customerData);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('customer_session_token');
        }
      } else {
        localStorage.removeItem('customer_session_token');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de session:', error);
      localStorage.removeItem('customer_session_token');
    }
  };

  const generateSessionToken = () => {
    return crypto.randomUUID() + '-' + Date.now().toString();
  };

  const signUp = async (data: SignUpData) => {
    setLoading(true);
    try {
      // Vérifier si l'email existe déjà
      const { data: existingAuth, error: checkError } = await supabase
        .from('customer_auth')
        .select('email')
        .eq('email', data.email)
        .single();

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
          address: data.address ? { street: data.address } : null
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
          email_verified: true // Pour simplifier, on marque comme vérifié
        }])
        .select()
        .single();

      if (authError) {
        // Supprimer le client si l'auth échoue
        await supabase.from('customers').delete().eq('id', customer.id);
        throw authError;
      }

      // Créer une session
      const sessionToken = generateSessionToken();
      const { error: sessionError } = await supabase.rpc('create_customer_session', {
        p_customer_id: customer.id,
        p_session_token: sessionToken,
        p_user_agent: navigator.userAgent || null
      });

      if (sessionError) throw sessionError;

      // Sauvegarder la session
      localStorage.setItem('customer_session_token', sessionToken);
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

      // Créer une session
      const sessionToken = generateSessionToken();
      const { error: sessionError } = await supabase.rpc('create_customer_session', {
        p_customer_id: customer.id,
        p_session_token: sessionToken,
        p_user_agent: navigator.userAgent || null
      });

      if (sessionError) throw sessionError;

      // Sauvegarder la session
      localStorage.setItem('customer_session_token', sessionToken);
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
      const sessionToken = localStorage.getItem('customer_session_token');
      if (sessionToken) {
        // Supprimer la session de la base de données
        await supabase
          .from('customer_sessions')
          .delete()
          .eq('session_token', sessionToken);
      }

      localStorage.removeItem('customer_session_token');
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

  return {
    currentCustomer,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    checkSession
  };
};
