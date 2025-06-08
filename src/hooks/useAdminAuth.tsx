
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('Initial session found for user:', session.user.email);
          setUser(session.user);
          await checkAdminProfile(session.user.id);
        } else {
          console.log('No initial session found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Admin auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          setUser(session.user);
          await checkAdminProfile(session.user.id);
        } else {
          setUser(null);
          setAdminProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminProfile = async (userId: string) => {
    try {
      console.log('Checking admin profile for user:', userId);
      setLoading(true);

      // Utiliser une requête directe sans RLS pour éviter la récursion
      const { data, error } = await supabase
        .rpc('is_admin', { user_id: userId });

      if (error) {
        console.error('Error checking admin status:', error);
        setAdminProfile(null);
        setLoading(false);
        return;
      }

      console.log('Admin check result:', data);

      if (data) {
        // Si l'utilisateur est admin, récupérer son profil
        const { data: profile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true)
          .single();

        if (profileError) {
          console.error('Error fetching admin profile:', profileError);
          setAdminProfile(null);
        } else {
          console.log('Admin profile found:', profile);
          setAdminProfile(profile);
          // Update last login
          await supabase
            .from('admin_profiles')
            .update({ last_login: new Date().toISOString() })
            .eq('id', profile.id);
        }
      } else {
        console.log('User is not an admin');
        setAdminProfile(null);
      }
    } catch (error) {
      console.error('Error in checkAdminProfile:', error);
      setAdminProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Attempting admin sign in with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      if (data.user) {
        console.log('Admin sign in successful:', data.user.email);
        // Ne pas faire checkAdminProfile ici car onAuthStateChange va le faire
        
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans l'administration !",
        });
        
        return data;
      }
    } catch (error: any) {
      console.error('Admin sign in error:', error);
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

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      console.log('Creating admin account for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      // Créer le profil admin manuellement
      if (data.user) {
        console.log('User created, creating admin profile...');
        const { error: profileError } = await supabase
          .from('admin_profiles')
          .insert({
            user_id: data.user.id,
            email: email,
            full_name: fullName,
            role: 'admin',
            is_active: true
          });

        if (profileError) {
          console.error('Error creating admin profile:', profileError);
          throw new Error('Erreur lors de la création du profil administrateur');
        } else {
          console.log('Admin profile created successfully');
        }
      }

      toast({
        title: "Compte admin créé",
        description: "Votre compte administrateur a été créé avec succès",
      });
      
      return data;
    } catch (error: any) {
      console.error('Admin sign up error:', error);
      toast({
        title: "Erreur lors de la création",
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setAdminProfile(null);

      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Erreur de déconnexion",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    user,
    adminProfile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin: !!adminProfile,
    isAuthenticated: !!user && !!adminProfile,
  };
};
