
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useCustomers } from './useCustomers';

interface CustomerAuthData {
  email: string;
  password: string;
}

interface CustomerData {
  name: string;
  email: string;
  phone?: string;
  address?: any;
}

export const useCustomerAuth = () => {
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string>('');
  const { createCustomer, updateCustomer } = useCustomers();

  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  const generateVerificationToken = (): string => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const signUp = async (customerData: CustomerData, password: string) => {
    if (!customerData.email) {
      throw new Error('L\'email est requis');
    }

    setLoading(true);
    try {
      console.log('Création du compte avec email:', customerData.email);
      
      // Vérifier si un compte avec cet email existe déjà
      const { data: existingAuth, error: checkError } = await supabase
        .from('customer_auth')
        .select('email')
        .eq('email', customerData.email)
        .maybeSingle();

      if (checkError) {
        console.error('Erreur lors de la vérification:', checkError);
        throw new Error('Erreur lors de la vérification du compte');
      }

      if (existingAuth) {
        throw new Error('Un compte avec cet email existe déjà');
      }

      // Créer ou récupérer le customer
      const customer = await createCustomer.mutateAsync(customerData);
      console.log('Customer créé:', customer);
      
      // Hasher le mot de passe
      const passwordHash = await hashPassword(password);
      console.log('Mot de passe hashé pour création');

      // Générer un token de vérification
      const verificationToken = generateVerificationToken();
      const tokenExpiry = new Date();
      tokenExpiry.setHours(tokenExpiry.getHours() + 24); // Token valide 24h
      
      // Créer l'authentification avec email non vérifié
      const { error } = await supabase
        .from('customer_auth')
        .insert({
          customer_id: customer.id,
          email: customerData.email,
          password_hash: passwordHash,
          email_verified: false,
          verification_token: verificationToken,
          verification_token_expires_at: tokenExpiry.toISOString()
        });

      if (error) {
        console.error('Erreur lors de la création de l\'auth:', error);
        throw error;
      }

      console.log('Authentification créée avec succès');
      
      // Afficher le popup de vérification d'email
      setPendingEmail(customerData.email);
      setShowEmailVerification(true);
      
      toast({
        title: "Compte créé avec succès",
        description: "Un email de vérification vous a été envoyé",
      });
    } catch (error: any) {
      console.error('Erreur complète lors de la création:', error);
      toast({
        title: "Erreur lors de la création du compte",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (verificationCode: string) => {
    setLoading(true);
    try {
      console.log('Vérification de l\'email avec le code:', verificationCode);
      
      // Vérifier le token de vérification
      const { data: authData, error: verifyError } = await supabase
        .from('customer_auth')
        .select(`
          customer_id,
          verification_token_expires_at,
          customers!inner(*)
        `)
        .eq('email', pendingEmail)
        .eq('verification_token', verificationCode)
        .eq('email_verified', false)
        .maybeSingle();

      if (verifyError) {
        console.error('Erreur lors de la vérification:', verifyError);
        throw new Error('Erreur lors de la vérification du code');
      }

      if (!authData) {
        throw new Error('Code de vérification invalide ou expiré');
      }

      // Vérifier que le token n'a pas expiré
      const now = new Date();
      const expiryDate = new Date(authData.verification_token_expires_at);
      if (now > expiryDate) {
        throw new Error('Le code de vérification a expiré');
      }

      // Marquer l'email comme vérifié
      const { error: updateError } = await supabase
        .from('customer_auth')
        .update({
          email_verified: true,
          verification_token: null,
          verification_token_expires_at: null
        })
        .eq('email', pendingEmail)
        .eq('verification_token', verificationCode);

      if (updateError) {
        console.error('Erreur lors de la mise à jour:', updateError);
        throw new Error('Erreur lors de la vérification');
      }

      console.log('Email vérifié avec succès');
      
      // Connecter l'utilisateur
      setCurrentCustomer(authData.customers);
      setIsAuthenticated(true);
      setShowEmailVerification(false);
      setPendingEmail('');
      
      toast({
        title: "Email vérifié avec succès",
        description: "Vous êtes maintenant connecté",
      });
    } catch (error: any) {
      console.error('Erreur de vérification:', error);
      toast({
        title: "Erreur de vérification",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async ({ email, password }: CustomerAuthData) => {
    setLoading(true);
    try {
      console.log('Tentative de connexion avec email:', email);
      
      // Hasher le mot de passe de la même façon qu'à la création
      const passwordHash = await hashPassword(password);
      console.log('Mot de passe hashé pour connexion');
      
      // Récupérer les données d'authentification avec jointure sur customers
      const { data: authData, error: authError } = await supabase
        .from('customer_auth')
        .select(`
          customer_id,
          email_verified,
          customers!inner(*)
        `)
        .eq('email', email)
        .eq('password_hash', passwordHash)
        .maybeSingle();

      console.log('Résultat de la requête auth:', { authData, authError });

      if (authError) {
        console.error('Erreur lors de la requête auth:', authError);
        throw new Error('Erreur lors de la vérification des identifiants');
      }

      if (!authData) {
        console.log('Aucune correspondance trouvée pour:', { email, passwordHash });
        throw new Error('Email ou mot de passe incorrect');
      }

      if (!authData.email_verified) {
        throw new Error('Votre email n\'a pas encore été vérifié. Veuillez vérifier votre boîte mail.');
      }

      console.log('Connexion réussie, données customer:', authData.customers);
      
      setCurrentCustomer(authData.customers);
      setIsAuthenticated(true);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });
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
    setCurrentCustomer(null);
    setIsAuthenticated(false);
    setShowEmailVerification(false);
    setPendingEmail('');
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
  };

  const updateProfile = async (customerData: Partial<CustomerData>) => {
    if (!currentCustomer) throw new Error('Aucun utilisateur connecté');
    
    setLoading(true);
    try {
      const updatedCustomer = await updateCustomer.mutateAsync({
        id: currentCustomer.id,
        ...customerData
      });
      
      setCurrentCustomer(updatedCustomer);
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées",
      });
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

  return {
    currentCustomer,
    isAuthenticated,
    loading,
    showEmailVerification,
    pendingEmail,
    signUp,
    signIn,
    signOut,
    updateProfile,
    verifyEmail,
  };
};
