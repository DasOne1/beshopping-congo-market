
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 Initialisation du système d\'authentification...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Changement d\'état d\'authentification:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Sauvegarder la session dans localStorage pour persistance
        if (session) {
          localStorage.setItem('supabase.auth.session', JSON.stringify(session));
        } else {
          localStorage.removeItem('supabase.auth.session');
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        // Vérifier d'abord dans localStorage
        const savedSession = localStorage.getItem('supabase.auth.session');
        if (savedSession) {
          console.log('📱 Session trouvée dans localStorage');
        }

        // Récupérer la session actuelle depuis Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erreur lors de la récupération de la session:', error);
          localStorage.removeItem('supabase.auth.session');
        }
        
        console.log('✅ Session récupérée:', session?.user?.email || 'Aucune session');
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('❌ Erreur d\'initialisation de l\'authentification:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log('🧹 Nettoyage de l\'authentification');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 Tentative de connexion pour:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('✅ Connexion réussie pour:', data.user?.email);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', error);
      toast({
        title: "Erreur de connexion",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Compte créé",
        description: "Votre compte a été créé avec succès",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('❌ Erreur lors de la création du compte:', error);
      toast({
        title: "Erreur lors de la création",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('🚪 Déconnexion en cours...');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Nettoyer le localStorage
      localStorage.removeItem('supabase.auth.session');
      
      console.log('✅ Déconnexion réussie');
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      console.error('❌ Erreur de déconnexion:', error);
      toast({
        title: "Erreur de déconnexion",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  };
};
