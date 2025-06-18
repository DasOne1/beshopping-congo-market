
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
  phone: string;
  email?: string;
  address?: string;
  password: string;
}

export const useCustomerAuth = () => {
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fonction pour vérifier et charger la session stockée
  const loadStoredSession = useCallback(() => {
    try {
      const customerId = localStorage.getItem('customer_id');
      const sessionToken = localStorage.getItem('customer_session_token');
      const customerData = localStorage.getItem('customer_data');
      
      console.log('🔍 Vérification session stockée:', { customerId, sessionToken, hasCustomerData: !!customerData });
      
      if (customerId && sessionToken && customerData) {
        const parsedCustomer = JSON.parse(customerData);
        console.log('✅ Session trouvée, restauration du client:', parsedCustomer.name);
        setCurrentCustomer(parsedCustomer);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Erreur lors du chargement de la session:', error);
      // Nettoyer les données corrompues
      localStorage.removeItem('customer_id');
      localStorage.removeItem('customer_session_token');
      localStorage.removeItem('customer_data');
      return false;
    }
  }, []);

  // Fonction pour vérifier la session sur le serveur
  const verifyServerSession = useCallback(async () => {
    const customerId = localStorage.getItem('customer_id');
    if (!customerId) return false;

    try {
      console.log('🔍 Vérification session serveur pour:', customerId);
      const { data: customerData, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();

      if (!error && customerData) {
        console.log('✅ Session serveur valide:', customerData.name);
        setCurrentCustomer(customerData);
        setIsAuthenticated(true);
        // Mettre à jour les données locales
        localStorage.setItem('customer_data', JSON.stringify(customerData));
        return true;
      } else {
        console.log('❌ Session serveur invalide:', error?.message);
        // Nettoyer les données invalides
        localStorage.removeItem('customer_session_token');
        localStorage.removeItem('customer_id');
        localStorage.removeItem('customer_data');
        setCurrentCustomer(null);
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error('❌ Erreur vérification serveur:', error);
      // En cas d'erreur réseau, utiliser les données locales si disponibles
      const savedData = localStorage.getItem('customer_data');
      if (savedData) {
        try {
          const customerData = JSON.parse(savedData);
          setCurrentCustomer(customerData);
          setIsAuthenticated(true);
          return true;
        } catch (parseError) {
          console.error('❌ Erreur parsing données locales:', parseError);
        }
      }
      return false;
    }
  }, []);

  // Initialisation de l'authentification
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Initialisation authentification client...');
      setLoading(true);
      
      // D'abord, essayer de charger la session locale
      const hasLocalSession = loadStoredSession();
      
      if (hasLocalSession) {
        // Si on a une session locale, vérifier avec le serveur en arrière-plan
        verifyServerSession().finally(() => setLoading(false));
      } else {
        // Pas de session locale
        console.log('❌ Aucune session locale trouvée');
        setLoading(false);
      }
    };

    initializeAuth();
  }, [loadStoredSession, verifyServerSession]);

  // Fonction pour persister la session
  const persistSession = useCallback((customer: Customer) => {
    const sessionToken = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    
    console.log('💾 Persistance de la session pour:', customer.name);
    localStorage.setItem('customer_session_token', sessionToken);
    localStorage.setItem('customer_id', customer.id);
    localStorage.setItem('customer_data', JSON.stringify(customer));
    
    setCurrentCustomer(customer);
    setIsAuthenticated(true);
  }, []);

  const signUp = async (data: SignUpData) => {
    setLoading(true);
    try {
      console.log('📝 Inscription du client:', data.name);
      
      // Vérifier si le numéro de téléphone existe déjà
      const [existingAuthResult, hashedPassword] = await Promise.all([
        supabase
          .from('customer_auth')
          .select('email')
          .eq('email', data.phone)
          .maybeSingle(),
        bcrypt.hash(data.password, 12)
      ]);

      if (existingAuthResult.data) {
        throw new Error('Un compte avec ce numéro de téléphone existe déjà');
      }

      // Créer le client et l'authentification
      const [customerResult, authResult] = await Promise.all([
        supabase
          .from('customers')
          .insert([{
            name: data.name,
            phone: data.phone,
            email: data.email || null,
            address: data.address ? { address: data.address } : null
          }])
          .select()
          .single(),
        supabase
          .from('customer_auth')
          .insert([{
            customer_id: null,
            email: data.phone,
            password_hash: hashedPassword,
            email_verified: true
          }])
          .select()
          .single()
      ]);

      if (customerResult.error) throw customerResult.error;
      if (authResult.error) throw authResult.error;

      // Lier l'authentification au client
      await supabase
        .from('customer_auth')
        .update({ customer_id: customerResult.data.id })
        .eq('id', authResult.data.id);

      // Persister la session
      persistSession(customerResult.data);

      toast({
        title: "Compte créé avec succès",
        description: "Votre compte a été créé et vous êtes maintenant connecté.",
      });

      console.log('✅ Inscription réussie pour:', customerResult.data.name);
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'inscription:', error);
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

  const signIn = async (phone: string, password: string) => {
    setLoading(true);
    try {
      console.log('🔑 Connexion du client:', phone);
      
      // Rechercher par numéro de téléphone
      const [authResult, customerResult] = await Promise.all([
        supabase
          .from('customer_auth')
          .select('*')
          .eq('email', phone)
          .single(),
        supabase
          .from('customers')
          .select('*')
          .eq('phone', phone)
          .single()
      ]);

      if (authResult.error || !authResult.data) {
        throw new Error('Numéro de téléphone ou mot de passe incorrect');
      }

      const isPasswordValid = await bcrypt.compare(password, authResult.data.password_hash);
      if (!isPasswordValid) {
        throw new Error('Numéro de téléphone ou mot de passe incorrect');
      }

      if (customerResult.error || !customerResult.data) {
        throw new Error('Données client introuvables');
      }

      // Persister la session
      persistSession(customerResult.data);

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });

      console.log('✅ Connexion réussie pour:', customerResult.data.name);
    } catch (error: any) {
      console.error('❌ Erreur lors de la connexion:', error);
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
      console.log('🚪 Déconnexion du client...');
      
      // Nettoyer toutes les données
      localStorage.removeItem('customer_session_token');
      localStorage.removeItem('customer_id');
      localStorage.removeItem('customer_data');
      
      setCurrentCustomer(null);
      setIsAuthenticated(false);

      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
      
      console.log('✅ Déconnexion réussie');
    } catch (error) {
      console.error('❌ Erreur lors de la déconnexion:', error);
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

      // Mettre à jour la session persistante
      persistSession(updatedCustomer);
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour du profil:', error);
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

  // Gestionnaire pour la fermeture de l'application
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentCustomer && isAuthenticated) {
        console.log('💾 Sauvegarde avant fermeture');
        localStorage.setItem('customer_data', JSON.stringify(currentCustomer));
        localStorage.setItem('customer_id', currentCustomer.id);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentCustomer, isAuthenticated]);

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
