/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface AdminProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAdminProfile = useCallback(async (user: User) => {
    try {
      const { data: profile, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error || !profile) {
        console.error('Admin profile not found:', error);
        setAdminProfile(null);
        setIsAuthenticated(false);
        return false;
      }

      setAdminProfile(profile);
      setIsAuthenticated(true);
      
      // Mettre à jour la dernière connexion
      await supabase
        .from('admin_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('user_id', user.id);

      return true;
    } catch (error) {
      console.error('Error checking admin profile:', error);
      setAdminProfile(null);
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  useEffect(() => {
    // Vérifier la session existante
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        checkAdminProfile(session.user).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Admin auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          setUser(session.user);
          await checkAdminProfile(session.user);
        } else {
          setUser(null);
          setAdminProfile(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [checkAdminProfile]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const isAdmin = await checkAdminProfile(data.user);
        if (!isAdmin) {
          await supabase.auth.signOut();
          throw new Error("Accès non autorisé - Compte administrateur requis");
        }
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'interface d'administration",
        });
      }
    } catch (error: any) {
      console.error('Admin sign in error:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/admin/auth`,
        },
      });

      if (error) throw error;

      toast({
        title: "Compte administrateur créé",
        description: "Veuillez vérifier votre boîte de réception pour confirmer votre e-mail.",
      });
    } catch (error: any) {
      console.error('Admin sign up error:', error);
      toast({
        title: "Erreur lors de la création",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setAdminProfile(null);
      setIsAuthenticated(false);

      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      console.error('Admin sign out error:', error);
      toast({
        title: "Erreur de déconnexion",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    adminProfile,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  };
};
