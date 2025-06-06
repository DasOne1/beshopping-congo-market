
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';

interface EmailAuthData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  address?: string;
}

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: any;
  created_at: string;
  updated_at: string;
  status: string | null;
  total_spent: number | null;
  orders_count: number | null;
}

export const useEmailAuth = () => {
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Générer un token de session sécurisé
  const generateSessionToken = useCallback(() => {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }, []);

  // Vérifier la session au démarrage
  useEffect(() => {
    const checkSession = async () => {
      try {
        const sessionToken = localStorage.getItem('customer_session_token');
        if (!sessionToken) {
          setLoading(false);
          return;
        }

        const { data: customerId, error } = await supabase
          .rpc('verify_session_token', { token: sessionToken });

        if (error || !customerId) {
          localStorage.removeItem('customer_session_token');
          setLoading(false);
          return;
        }

        // Récupérer les données du client
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('id', customerId)
          .single();

        if (customer && !customerError) {
          setCurrentCustomer(customer);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('customer_session_token');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de session:', error);
        localStorage.removeItem('customer_session_token');
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signUp = async (authData: EmailAuthData) => {
    setLoading(true);
    try {
      // Vérifier si l'email existe déjà
      const { data: existingAuth, error: checkError } = await supabase
        .from('customer_auth')
        .select('email')
        .eq('email', authData.email.toLowerCase())
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingAuth) {
        throw new Error('Un compte avec cet email existe déjà');
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(authData.password, 12);

      // Créer le client d'abord
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: authData.name || '',
          email: authData.email.toLowerCase(),
          phone: authData.phone || null,
          address: authData.address ? { address: authData.address } : null,
          status: 'active',
          total_spent: 0,
          orders_count: 0
        })
        .select()
        .single();

      if (customerError) throw customerError;

      // Créer l'entrée d'authentification
      const { error: authError } = await supabase
        .from('customer_auth')
        .insert({
          customer_id: customer.id,
          email: authData.email.toLowerCase(),
          password_hash: hashedPassword,
          email_verified: true // Pour simplifier, on considère l'email comme vérifié
        });

      if (authError) {
        // Supprimer le client si l'auth échoue
        await supabase.from('customers').delete().eq('id', customer.id);
        throw authError;
      }

      // Créer une session
      const sessionToken = generateSessionToken();
      await supabase.rpc('create_customer_session', {
        p_customer_id: customer.id,
        p_session_token: sessionToken,
        p_user_agent: navigator.userAgent
      });

      // Stocker le token
      localStorage.setItem('customer_session_token', sessionToken);

      setCurrentCustomer(customer);
      setIsAuthenticated(true);

      toast({
        title: "Compte créé avec succès",
        description: "Bienvenue !",
      });

      return customer;
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

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Récupérer les données d'authentification
      const { data: authData, error: authError } = await supabase
        .from('customer_auth')
        .select('*, customers(*)')
        .eq('email', email.toLowerCase())
        .eq('email_verified', true)
        .maybeSingle();

      if (authError || !authData) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Vérifier le mot de passe
      const passwordMatch = await bcrypt.compare(password, authData.password_hash);
      if (!passwordMatch) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const customer = authData.customers;
      if (!customer) {
        throw new Error('Compte client introuvable');
      }

      // Créer une session
      const sessionToken = generateSessionToken();
      await supabase.rpc('create_customer_session', {
        p_customer_id: customer.id,
        p_session_token: sessionToken,
        p_user_agent: navigator.userAgent
      });

      // Stocker le token
      localStorage.setItem('customer_session_token', sessionToken);

      setCurrentCustomer(customer);
      setIsAuthenticated(true);

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
        description: "À bientôt !",
      });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, on déconnecte localement
      localStorage.removeItem('customer_session_token');
      setCurrentCustomer(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (updateData: Partial<EmailAuthData> & { currentPassword?: string }) => {
    if (!currentCustomer) throw new Error('Aucun utilisateur connecté');
    
    setLoading(true);
    try {
      let updates: any = {};
      
      // Préparer les mises à jour pour la table customers
      if (updateData.name !== undefined) updates.name = updateData.name;
      if (updateData.phone !== undefined) updates.phone = updateData.phone;
      if (updateData.address !== undefined) {
        updates.address = updateData.address ? { address: updateData.address } : null;
      }

      // Si l'email change, vérifier qu'il n'existe pas déjà
      if (updateData.email && updateData.email !== currentCustomer.email) {
        const { data: existing } = await supabase
          .from('customer_auth')
          .select('email')
          .eq('email', updateData.email.toLowerCase())
          .neq('customer_id', currentCustomer.id)
          .maybeSingle();

        if (existing) {
          throw new Error('Cet email est déjà utilisé');
        }

        updates.email = updateData.email.toLowerCase();
      }

      // Mettre à jour le client
      if (Object.keys(updates).length > 0) {
        const { data: updatedCustomer, error: customerError } = await supabase
          .from('customers')
          .update(updates)
          .eq('id', currentCustomer.id)
          .select()
          .single();

        if (customerError) throw customerError;
        setCurrentCustomer(updatedCustomer);
      }

      // Mettre à jour l'email dans customer_auth si nécessaire
      if (updateData.email && updateData.email !== currentCustomer.email) {
        const { error: authEmailError } = await supabase
          .from('customer_auth')
          .update({ email: updateData.email.toLowerCase() })
          .eq('customer_id', currentCustomer.id);

        if (authEmailError) throw authEmailError;
      }

      // Mettre à jour le mot de passe si fourni
      if (updateData.password && updateData.currentPassword) {
        // Vérifier le mot de passe actuel
        const { data: authData, error: authError } = await supabase
          .from('customer_auth')
          .select('password_hash')
          .eq('customer_id', currentCustomer.id)
          .single();

        if (authError) throw authError;

        const passwordMatch = await bcrypt.compare(updateData.currentPassword, authData.password_hash);
        if (!passwordMatch) {
          throw new Error('Le mot de passe actuel est incorrect');
        }

        // Hasher le nouveau mot de passe
        const hashedPassword = await bcrypt.hash(updateData.password, 12);

        const { error: passwordError } = await supabase
          .from('customer_auth')
          .update({ password_hash: hashedPassword })
          .eq('customer_id', currentCustomer.id);

        if (passwordError) throw passwordError;
      }

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées",
      });

    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
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
