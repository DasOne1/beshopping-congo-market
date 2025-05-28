
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from './useAuth';

export interface UserFavorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  products?: {
    id: string;
    name: string;
    images: string[];
    original_price: number;
    discounted_price?: number;
  };
}

export const useUserFavorites = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          products (
            id,
            name,
            images,
            original_price,
            discounted_price
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserFavorite[];
    },
    enabled: !!user?.id,
  });

  const addToFavorites = useMutation({
    mutationFn: async (productId: string) => {
      if (!user?.id) throw new Error('Utilisateur non connecté');
      
      const { data, error } = await supabase
        .from('favorites')
        .insert([{ user_id: user.id, product_id: productId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      toast({
        title: "Ajouté aux favoris",
        description: "Le produit a été ajouté à vos favoris",
      });
    },
    onError: (error: any) => {
      if (error.code === '23505') {
        toast({
          title: "Déjà en favoris",
          description: "Ce produit est déjà dans vos favoris",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const removeFromFavorites = useMutation({
    mutationFn: async (productId: string) => {
      if (!user?.id) throw new Error('Utilisateur non connecté');
      
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      toast({
        title: "Retiré des favoris",
        description: "Le produit a été retiré de vos favoris",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.product_id === productId);
  };

  return {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };
};
