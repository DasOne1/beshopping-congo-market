
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
    const customerData = localStorage.getItem('customer_data');
    if (customerId && sessionToken && customerData) {
      try {
        return JSON.parse(customerData);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialiser l'état d'authentification avec les données du localStorage
    return !!localStorage.getItem('customer_session_token');
  });

  // Vérifier la session au chargement et lors du retour en ligne
  useEffect(() => {
    const verifySession = async () => {
      const sessionToken = localStorage.getItem('customer_session_token');
      const customerId = localStorage.getItem('customer_id');
      
      if (!sessionToken || !customerId) {
        return;
      }

      try {
        // Si on est hors ligne, utiliser les données en cache
        if (!navigator.onLine) {
          const cachedData = localStorage.getItem('customer_data');
          if (cachedData) {
            setCurrentCustomer(JSON.parse(cachedData));
            setIsAuthenticated(true);
            return;
          }
        }

        // Si on est en ligne, vérifier avec le serveur
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
        // En cas d'erreur de connexion, utiliser les données en cache
        const cachedData = localStorage.getItem('customer_data');
        if (cachedData) {
          try {
            setCurrentCustomer(JSON.parse(cachedData));
            setIsAuthenticated(true);
          } catch {
            // Si les données en cache sont corrompues, nettoyer
            localStorage.removeItem('customer_session_token');
            localStorage.removeItem('customer_id');
            localStorage.removeItem('customer_data');
            setCurrentCustomer(null);
            setIsAuthenticated(false);
          }
        }
      }
    };

    verifySession();

    // Écouter les changements d'état de connexion
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
      console.log('Début inscription client:', data.email);

      // Vérifier si l'email existe déjà
      const { data: existingAuth, error: checkError } = await supabase
        .from('customer_auth')
        .select('email')
        .eq('email', data.email)
        .maybeSingle();

      if (checkError) {
        console.error('Erreur lors de la vérification email:', checkError);
        throw new Error('Erreur lors de la vérification de l\'email');
      }

      if (existingAuth) {
        throw new Error('Un compte avec cet email existe déjà');
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(data.password, 12);
      console.log('Mot de passe hashé');

      // Créer le client
      const { data: customerResult, error: customerError } = await supabase
        .from('customers')
        .insert([{
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          address: data.address ? { address: data.address } : null,
          status: 'active',
          orders_count: 0,
          total_spent: 0
        }])
        .select()
        .single();

      if (customerError) {
        console.error('Erreur création client:', customerError);
        throw new Error('Erreur lors de la création du profil client');
      }

      console.log('Client créé:', customerResult.id);

      // Créer l'authentification
      const { data: authResult, error: authError } = await supabase
        .from('customer_auth')
        .insert([{
          customer_id: customerResult.id,
          email: data.email,
          password_hash: hashedPassword,
          email_verified: true
        }])
        .select()
        .single();

      if (authError) {
        console.error('Erreur création auth:', authError);
        // Nettoyer le client créé en cas d'erreur
        await supabase.from('customers').delete().eq('id', customerResult.id);
        throw new Error('Erreur lors de la création de l\'authentification');
      }

      console.log('Authentification créée');

      // Créer la session
      const sessionToken = generateSessionToken();
      localStorage.setItem('customer_session_token', sessionToken);
      localStorage.setItem('customer_id', customerResult.id);
      localStorage.setItem('customer_data', JSON.stringify(customerResult));
      setCurrentCustomer(customerResult);
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
      console.log('Début connexion client:', email);

      // Récupérer l'authentification
      const { data: authResult, error: authError } = await supabase
        .from('customer_auth')
        .select('*')
        .eq('email', email)
        .single();

      if (authError || !authResult) {
        console.error('Erreur auth lookup:', authError);
        throw new Error('Email ou mot de passe incorrect');
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, authResult.password_hash);
      if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect');
      }

      console.log('Mot de passe validé');

      // Récupérer les données client
      const { data: customerResult, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', authResult.customer_id)
        .single();

      if (customerError || !customerResult) {
        console.error('Erreur customer lookup:', customerError);
        throw new Error('Données client introuvables');
      }

      console.log('Client trouvé:', customerResult.id);

      // Créer la session
      const sessionToken = generateSessionToken();
      localStorage.setItem('customer_session_token', sessionToken);
      localStorage.setItem('customer_id', customerResult.id);
      localStorage.setItem('customer_data', JSON.stringify(customerResult));
      setCurrentCustomer(customerResult);
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
