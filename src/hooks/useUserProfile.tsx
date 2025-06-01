
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCustomers } from '@/hooks/useCustomers';
import { toast } from '@/hooks/use-toast';

export interface UserProfile {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
}

export const useUserProfile = () => {
  const { user, isAuthenticated } = useAuth();
  const { customers, createCustomer, updateCustomer } = useCustomers();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Chercher le profil utilisateur dans la table customers
  useEffect(() => {
    if (isAuthenticated && user && customers.length > 0) {
      // Chercher par email ou téléphone
      const profile = customers.find(customer => 
        customer.email === user.email || 
        customer.phone === user.user_metadata?.phone
      );
      
      if (profile) {
        setUserProfile({
          id: profile.id,
          name: profile.name,
          phone: profile.phone || '',
          email: profile.email || user.email || '',
          address: typeof profile.address === 'object' && profile.address?.address 
            ? profile.address.address 
            : profile.address || ''
        });
      } else {
        // Créer un profil par défaut basé sur les métadonnées
        setUserProfile({
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || '',
          phone: user.user_metadata?.phone || '',
          email: user.email || '',
          address: user.user_metadata?.address || ''
        });
      }
    } else if (!isAuthenticated) {
      setUserProfile(null);
    }
  }, [isAuthenticated, user, customers]);

  const saveProfile = async (profileData: Omit<UserProfile, 'id'>) => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour modifier votre profil",
        variant: "destructive",
      });
      return false;
    }

    setIsLoading(true);
    
    try {
      if (userProfile?.id) {
        // Mettre à jour le profil existant
        await updateCustomer.mutateAsync({
          id: userProfile.id,
          name: profileData.name,
          phone: profileData.phone,
          email: profileData.email,
          address: profileData.address
        });
      } else {
        // Créer un nouveau profil
        await createCustomer.mutateAsync({
          name: profileData.name,
          phone: profileData.phone,
          email: profileData.email,
          address: profileData.address
        });
      }

      setUserProfile({
        ...userProfile,
        ...profileData
      });

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès",
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du profil:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le profil",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userProfile,
    saveProfile,
    isLoading: isLoading || createCustomer.isPending || updateCustomer.isPending,
    hasProfile: !!userProfile?.id
  };
};
