
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';

interface CustomerData {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  password: string;
}

interface LoginData {
  phone: string;
  password: string;
}

interface StoredSession {
  customer: any;
  timestamp: number;
  expiresAt: number;
}

const SESSION_STORAGE_KEY = 'customer_session';
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

export const useEnhancedCustomerAuth = () => {
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Load session on startup
  useEffect(() => {
    loadStoredSession();
  }, []);

  // Auto-save session when customer changes
  useEffect(() => {
    if (currentCustomer) {
      saveSession(currentCustomer);
    }
  }, [currentCustomer]);

  const loadStoredSession = async () => {
    try {
      setSessionLoading(true);
      const storedSessionData = localStorage.getItem(SESSION_STORAGE_KEY);
      
      if (storedSessionData) {
        const sessionData: StoredSession = JSON.parse(storedSessionData);
        
        // Check if session is still valid
        if (Date.now() < sessionData.expiresAt) {
          // Verify customer still exists in database
          const { data: customer, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', sessionData.customer.id)
            .maybeSingle();

          if (customer && !error) {
            setCurrentCustomer(customer);
            setIsAuthenticated(true);
            console.log('Session restaurée pour:', customer.name);
            
            toast({
              title: "Bon retour !",
              description: `Connecté en tant que ${customer.name}`,
            });
          } else {
            // Customer no longer exists, clear session
            clearStoredSession();
          }
        } else {
          // Session expired
          clearStoredSession();
          toast({
            title: "Session expirée",
            description: "Veuillez vous reconnecter",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la session:', error);
      clearStoredSession();
    } finally {
      setSessionLoading(false);
      setLoading(false);
    }
  };

  const saveSession = (customer: any) => {
    try {
      const sessionData: StoredSession = {
        customer,
        timestamp: Date.now(),
        expiresAt: Date.now() + SESSION_DURATION
      };
      
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
      console.log('Session sauvegardée pour:', customer.name);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la session:', error);
    }
  };

  const clearStoredSession = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    setCurrentCustomer(null);
    setIsAuthenticated(false);
  };

  const signUp = async (customerData: CustomerData) => {
    setLoading(true);
    try {
      console.log('Création du compte client...');
      
      // Check if phone number already exists
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('phone')
        .eq('phone', customerData.phone)
        .maybeSingle();

      if (existingCustomer) {
        throw new Error('Ce numéro de téléphone est déjà utilisé');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(customerData.password, 10);

      // Create customer
      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert({
          name: customerData.name,
          phone: customerData.phone,
          email: customerData.email || null,
          address: customerData.address || null,
          password_hash: hashedPassword,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création du compte:', error);
        throw new Error('Erreur lors de la création du compte');
      }

      console.log('Compte créé avec succès:', newCustomer);
      
      // Auto-login after signup
      setCurrentCustomer(newCustomer);
      setIsAuthenticated(true);
      
      toast({
        title: "Compte créé avec succès",
        description: "Bienvenue !",
      });

      return newCustomer;
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

  const signIn = async (loginData: LoginData) => {
    setLoading(true);
    try {
      console.log('Connexion du client...');
      
      // Find customer by phone
      const { data: customer, error } = await supabase
        .from('customers')
        .select('*, password_hash')
        .eq('phone', loginData.phone)
        .maybeSingle();

      if (error || !customer) {
        throw new Error('Numéro de téléphone ou mot de passe incorrect');
      }

      // Check password
      if (!customer.password_hash) {
        throw new Error('Aucun mot de passe défini pour ce compte');
      }

      const passwordMatch = await bcrypt.compare(loginData.password, customer.password_hash);
      
      if (!passwordMatch) {
        throw new Error('Numéro de téléphone ou mot de passe incorrect');
      }

      console.log('Connexion réussie:', customer);
      
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

  const signOut = () => {
    clearStoredSession();
    
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
  };

  const updateProfile = async (customerData: Partial<CustomerData>) => {
    if (!currentCustomer) throw new Error('Aucun utilisateur connecté');
    
    setLoading(true);
    try {
      let updateData: any = { ...customerData };
      
      // Hash new password if provided
      if (customerData.password) {
        updateData.password_hash = await bcrypt.hash(customerData.password, 10);
        delete updateData.password;
      }

      const { data: updatedCustomer, error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', currentCustomer.id)
        .select()
        .single();

      if (error) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }
      
      setCurrentCustomer(updatedCustomer);
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées",
      });

      return updatedCustomer;
    } catch (error: any) {
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

  // Check if session is valid
  const isSessionValid = () => {
    try {
      const storedSessionData = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!storedSessionData) return false;
      
      const sessionData: StoredSession = JSON.parse(storedSessionData);
      return Date.now() < sessionData.expiresAt;
    } catch {
      return false;
    }
  };

  // Extend session
  const extendSession = () => {
    if (currentCustomer && isAuthenticated) {
      saveSession(currentCustomer);
    }
  };

  return {
    currentCustomer,
    isAuthenticated,
    loading,
    sessionLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    isSessionValid,
    extendSession,
  };
};
