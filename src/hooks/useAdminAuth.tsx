
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface AdminProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
}

export const useAdminAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchAdminProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Admin auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchAdminProfile(session.user.id);
        } else {
          setAdminProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchAdminProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching admin profile:', error);
        setAdminProfile(null);
      } else {
        setAdminProfile(data);
      }
    } catch (error) {
      console.error('Error fetching admin profile:', error);
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

      if (error) throw error;

      // Vérifier si l'utilisateur est un admin
      const { data: isAdminData, error: isAdminError } = await supabase
        .rpc('is_admin', { user_id: data.user.id });

      if (isAdminError) {
        console.error('Error checking admin status:', isAdminError);
        await supabase.auth.signOut();
        throw new Error('Erreur lors de la vérification des droits administrateur');
      }

      if (!isAdminData) {
        await supabase.auth.signOut();
        throw new Error('Accès refusé. Vous n\'avez pas les droits administrateur.');
      }

      // Mettre à jour la dernière connexion
      await supabase
        .from('admin_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('user_id', data.user.id);

      console.log('Admin sign in successful:', data.user?.email);
      
      toast({
        title: "Connexion administrative réussie",
        description: "Bienvenue dans l'espace administrateur !",
      });
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            is_admin: 'true',
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Compte administrateur créé",
        description: "Votre compte administrateur a été créé avec succès",
      });
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

      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
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
    isAuthenticated: !!user && !!adminProfile,
    isAdmin: !!adminProfile?.is_active,
  };
};
