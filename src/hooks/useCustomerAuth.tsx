
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const useCustomerAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 Initialisation de l\'authentification client...');
    
    // Configurer l'écouteur d'état d'authentification EN PREMIER
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Changement d\'état authentification client:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Persister dans localStorage de manière sûre
        if (session) {
          try {
            localStorage.setItem('customer.auth.session', JSON.stringify(session));
            localStorage.setItem('customer.auth.user', JSON.stringify(session.user));
            console.log('✅ Session client sauvegardée dans localStorage');
          } catch (error) {
            console.error('❌ Erreur sauvegarde session localStorage:', error);
          }
        } else {
          localStorage.removeItem('customer.auth.session');
          localStorage.removeItem('customer.auth.user');
          console.log('🧹 Session client supprimée de localStorage');
        }
      }
    );

    // ENSUITE vérifier la session existante
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // Essayer de restaurer depuis localStorage d'abord
        const savedSession = localStorage.getItem('customer.auth.session');
        const savedUser = localStorage.getItem('customer.auth.user');
        
        if (savedSession && savedUser) {
          console.log('📱 Session client trouvée dans localStorage');
          try {
            const sessionData = JSON.parse(savedSession);
            const userData = JSON.parse(savedUser);
            
            // Vérifier que la session n'est pas expirée
            if (sessionData.expires_at && new Date(sessionData.expires_at * 1000) > new Date()) {
              setSession(sessionData);
              setUser(userData);
              console.log('✅ Session client restaurée depuis localStorage');
            } else {
              console.log('⏰ Session client expirée, nettoyage...');
              localStorage.removeItem('customer.auth.session');
              localStorage.removeItem('customer.auth.user');
            }
          } catch (error) {
            console.error('❌ Erreur parsing session cliente:', error);
            localStorage.removeItem('customer.auth.session');
            localStorage.removeItem('customer.auth.user');
          }
        }

        // Valider/récupérer la session depuis Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erreur récupération session cliente:', error);
          // Nettoyer localStorage en cas d'erreur
          localStorage.removeItem('customer.auth.session');
          localStorage.removeItem('customer.auth.user');
          setSession(null);
          setUser(null);
        } else if (session) {
          console.log('✅ Session cliente validée depuis Supabase:', session.user.email);
          setSession(session);
          setUser(session.user);
          
          // Sauvegarder la session validée
          try {
            localStorage.setItem('customer.auth.session', JSON.stringify(session));
            localStorage.setItem('customer.auth.user', JSON.stringify(session.user));
          } catch (error) {
            console.error('❌ Erreur sauvegarde session validée:', error);
          }
        } else {
          console.log('ℹ️ Aucune session cliente active');
          setSession(null);
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Erreur initialisation authentification cliente:', error);
        setSession(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      console.log('🧹 Nettoyage authentification cliente');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 Tentative connexion client:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('✅ Connexion client réussie:', data.user?.email);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('❌ Erreur connexion client:', error);
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
      console.log('📝 Création compte client:', email);
      
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

      console.log('✅ Compte client créé:', data.user?.email);
      toast({
        title: "Compte créé",
        description: "Votre compte a été créé avec succès",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('❌ Erreur création compte client:', error);
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
      console.log('🚪 Déconnexion client...');
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Nettoyer localStorage
      localStorage.removeItem('customer.auth.session');
      localStorage.removeItem('customer.auth.user');
      
      console.log('✅ Déconnexion client réussie');
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
    } catch (error: any) {
      console.error('❌ Erreur déconnexion client:', error);
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
