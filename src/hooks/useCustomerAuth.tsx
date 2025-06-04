/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  currentPassword?: string; // Pour la mise à jour du profil
}

interface LoginData {
  phone: string;
  password: string;
}

// Fonction pour normaliser les numéros de téléphone
const normalizePhoneNumber = (phone: string): string => {
  // Supprimer tous les caractères non numériques
  let cleaned = phone.replace(/\D/g, '');
  
  // Si le numéro commence par 0, le remplacer par 243
  if (cleaned.startsWith('0')) {
    cleaned = '243' + cleaned.substring(1);
  }
  
  // Si le numéro commence par 243, s'assurer qu'il a la bonne longueur
  if (cleaned.startsWith('243')) {
    // Un numéro congolais complet doit avoir 12 chiffres (243 + 9 chiffres)
    if (cleaned.length === 12) {
      return cleaned;
    }
  }
  
  // Si le numéro n'a pas le bon format, retourner le numéro original
  return phone;
};

export const useCustomerAuth = () => {
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Charger l'état de connexion au démarrage
  useEffect(() => {
    const loadAuthState = async () => {
      const savedCustomerId = localStorage.getItem('customerId');
      const savedCustomerData = localStorage.getItem('customerData');
      
      if (savedCustomerId && savedCustomerData) {
        try {
          // En mode hors ligne, utiliser les données stockées
          if (!navigator.onLine) {
            const customerData = JSON.parse(savedCustomerData);
            setCurrentCustomer(customerData);
            setIsAuthenticated(true);
            return;
          }

          // En mode en ligne, vérifier avec Supabase
          const { data: customer, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', savedCustomerId)
            .single();

          if (customer && !error) {
            setCurrentCustomer(customer);
            setIsAuthenticated(true);
            // Mettre à jour les données stockées
            localStorage.setItem('customerData', JSON.stringify(customer));
          } else {
            // Si le client n'existe plus, nettoyer le localStorage
            localStorage.removeItem('customerId');
            localStorage.removeItem('customerData');
          }
        } catch (error) {
          console.error('Erreur lors du chargement de l\'état de connexion:', error);
          // En cas d'erreur, utiliser les données stockées si disponibles
          if (savedCustomerData) {
            const customerData = JSON.parse(savedCustomerData);
            setCurrentCustomer(customerData);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('customerId');
            localStorage.removeItem('customerData');
          }
        }
      }
    };

    loadAuthState();
  }, []);

  const signUp = async (customerData: CustomerData) => {
    setLoading(true);
    try {
      console.log('Création du compte client...');
      
      // Normaliser le numéro de téléphone
      const normalizedPhone = normalizePhoneNumber(customerData.phone);
      
      // Vérifier si le client existe déjà
      const { data: existingCustomer, error: searchError } = await supabase
        .from('customers')
        .select('phone')
        .eq('phone', normalizedPhone)
        .maybeSingle();

      if (searchError) throw searchError;

      if (existingCustomer) {
        throw new Error('Ce numéro de téléphone est déjà utilisé');
      }

      // Vérifier la longueur du mot de passe
      if (customerData.password.length < 4) {
        throw new Error('Le mot de passe doit contenir au moins 4 caractères');
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(customerData.password, 10);

      // Créer le customer avec le numéro normalisé
      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert({
          name: customerData.name,
          phone: normalizedPhone,
          email: customerData.email || null,
          address: customerData.address || null,
          password_hash: hashedPassword,
          status: 'active',
          total_spent: 0,
          orders_count: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création du compte:', error);
        throw new Error('Erreur lors de la création du compte');
      }

      // Mettre à jour l'état immédiatement
      const customerToStore = {
        ...newCustomer,
        password_hash: undefined
      };
      
      setCurrentCustomer(customerToStore);
      setIsAuthenticated(true);
      localStorage.setItem('customerId', newCustomer.id);
      localStorage.setItem('customerData', JSON.stringify(customerToStore));
      
      toast({
        title: "Compte créé avec succès",
        description: "Bienvenue !",
      });

      return customerToStore;
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
      
      // Normaliser le numéro de téléphone
      const normalizedPhone = normalizePhoneNumber(loginData.phone);
      
      const { data: customer, error } = await supabase
        .from('customers')
        .select('*, password_hash')
        .eq('phone', normalizedPhone)
        .maybeSingle();

      if (error || !customer) {
        throw new Error('Numéro de téléphone ou mot de passe incorrect');
      }

      if (!customer.password_hash) {
        throw new Error('Aucun mot de passe défini pour ce compte');
      }

      const passwordMatch = await bcrypt.compare(loginData.password, customer.password_hash);
      
      if (!passwordMatch) {
        throw new Error('Numéro de téléphone ou mot de passe incorrect');
      }

      // Préparer les données du client sans le hash du mot de passe
      const customerToStore = {
        ...customer,
        password_hash: undefined
      };
      
      // Mettre à jour l'état immédiatement
      setCurrentCustomer(customerToStore);
      setIsAuthenticated(true);
      localStorage.setItem('customerId', customer.id);
      localStorage.setItem('customerData', JSON.stringify(customerToStore));
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue !",
      });

      return customerToStore;
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
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerData');
    
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
      
      // Normaliser le numéro de téléphone si présent
      if (updateData.phone) {
        updateData.phone = normalizePhoneNumber(updateData.phone);
      }

      // Vérifier si le mot de passe actuel est requis
      const requiresPassword = updateData.name || updateData.phone || updateData.email || updateData.address;
      
      if (requiresPassword && !customerData.currentPassword) {
        throw new Error('Le mot de passe actuel est requis pour modifier vos informations');
      }

      // Vérifier le mot de passe actuel si fourni
      if (customerData.currentPassword) {
        const { data: customer, error } = await supabase
          .from('customers')
          .select('password_hash')
          .eq('id', currentCustomer.id)
          .single();

        if (error) throw new Error('Erreur lors de la vérification du mot de passe');

        const passwordMatch = await bcrypt.compare(customerData.currentPassword, customer.password_hash);
        if (!passwordMatch) {
          throw new Error('Le mot de passe actuel est incorrect');
        }
      }
      
      // Si un nouveau mot de passe est fourni, le hasher
      if (customerData.password && customerData.password.trim() !== '') {
        if (customerData.password.length < 4) {
          throw new Error('Le nouveau mot de passe doit contenir au moins 4 caractères');
        }
        updateData.password_hash = await bcrypt.hash(customerData.password, 10);
      }
      delete updateData.password;

      // Supprimer le mot de passe actuel des données de mise à jour
      delete updateData.currentPassword;

      // Vérifier si des données ont été modifiées
      const hasChanges = Object.keys(updateData).some(key => 
        updateData[key] !== currentCustomer[key]
      );

      if (!hasChanges) {
        throw new Error('Aucune modification n\'a été effectuée');
      }

      // Mettre à jour les données localement immédiatement
      const updatedLocalData = {
        ...currentCustomer,
        ...updateData,
        password_hash: undefined
      };
      setCurrentCustomer(updatedLocalData);
      localStorage.setItem('customerData', JSON.stringify(updatedLocalData));

      // Envoyer la mise à jour à Supabase
      const { data: updatedCustomer, error } = await supabase
        .from('customers')
        .update(updateData)
        .eq('id', currentCustomer.id)
        .select()
        .single();

      if (error) {
        // En cas d'erreur, restaurer les données précédentes
        setCurrentCustomer(currentCustomer);
        localStorage.setItem('customerData', JSON.stringify(currentCustomer));
        throw new Error('Erreur lors de la mise à jour du profil. Veuillez réessayer.');
      }
      
      // Mettre à jour avec les données du serveur
      const customerToStore = {
        ...updatedCustomer,
        password_hash: undefined
      };
      setCurrentCustomer(customerToStore);
      localStorage.setItem('customerData', JSON.stringify(customerToStore));
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès",
      });

      return customerToStore;
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
    signUp,
    signIn,
    signOut,
    updateProfile,
  };
};
