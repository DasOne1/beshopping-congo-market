
import { useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Customer } from '@/types';

export const useCustomerAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCustomer, setLoadingCustomer] = useState(false);

  const fetchCustomerData = useCallback(async (userId: string) => {
    if (!userId) {
      setCurrentCustomer(null);
      return;
    }
    setLoadingCustomer(true);
    try {
      console.log('👤 Fetching customer data for user ID:', userId);
      const { data, error, status } = await supabase
        .from('customers')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && status !== 406) { // 406 is when no rows are found, which is fine
        throw error;
      }

      if (data) {
        console.log('✅ Customer data fetched:', data);
        setCurrentCustomer(data as Customer);
      } else {
        console.log('ℹ️ No customer data found for user ID:', userId);
        setCurrentCustomer(null);
      }
    } catch (error: any) {
      console.error('❌ Error fetching customer data:', error);
      setCurrentCustomer(null);
      // Optional: Show a toast, but might be too noisy if user logs in and doesn't have a customer profile yet
      // toast({
      //   title: "Erreur de chargement du profil",
      //   description: "Impossible de charger les informations du profil.",
      //   variant: "destructive",
      // });
    } finally {
      setLoadingCustomer(false);
    }
  }, []);

  useEffect(() => {
    console.log('🔄 Initialisation de l\'authentification client...');
    
    // Configurer l'écouteur d'état d'authentification EN PREMIER
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Changement d\'état authentification client:', event, session?.user?.email);
        
        const currentUser = session?.user ?? null;
        setSession(session);
        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
          fetchCustomerData(currentUser.id);
        } else {
          setCurrentCustomer(null);
        }

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
    if (user) {
      fetchCustomerData(user.id);
    } else {
      setCurrentCustomer(null);
    }
  }, [user, fetchCustomerData]);

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
      setCurrentCustomer(null); // Clear customer data on sign out
      
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

  const updateProfile = async (profileData: Partial<Customer>) => {
    if (!user) {
      toast({
        title: "Utilisateur non connecté",
        description: "Vous devez être connecté pour mettre à jour votre profil.",
        variant: "destructive",
      });
      return { data: null, error: { message: "User not authenticated" } };
    }

    console.log('🔄 Mise à jour du profil client:', profileData);
    setLoadingCustomer(true);
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Profil client mis à jour:', data);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées.",
      });
      // Refresh customer data
      if (data) {
        setCurrentCustomer(data as Customer);
      } else {
        // Fallback to refetch if select().single() didn't return data as expected
        await fetchCustomerData(user.id);
      }
      return { data, error: null };
    } catch (error: any) {
      console.error('❌ Erreur mise à jour profil client:', error);
      toast({
        title: "Erreur de mise à jour",
        description: error.message || "Un problème est survenu lors de la mise à jour de votre profil.",
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoadingCustomer(false);
    }
  };

  return {
    user,
    session,
    currentCustomer,
    loading: loading || loadingCustomer, // Combine general auth loading with customer data loading
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAuthenticated: !!user,
  };
};
