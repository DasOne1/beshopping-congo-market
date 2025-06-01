
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.phone);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (phone: string, password: string) => {
    try {
      console.log('Attempting to sign in with phone:', phone);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        phone,
        password,
      });

      if (error) throw error;

      console.log('Sign in successful:', data.user?.phone);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (phone: string, password: string, fullName: string, email?: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        phone,
        password,
        options: {
          data: {
            full_name: fullName,
            email: email || null,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Compte créé",
        description: "Votre compte a été créé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur lors de la création",
        description: error.message,
        variant: "destructive",
      });
      throw error;
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
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };
};
