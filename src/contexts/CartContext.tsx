
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartTotal: () => number;
  getTotalQuantity: () => number; // Ajout de cette fonction pour compatibilité
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cache local pour le panier avec persistance optimisée
const CART_STORAGE_KEY = 'beshopping-cart';

let cartCache: CartItem[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCartFromCache = (): CartItem[] | null => {
  if (cartCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return cartCache;
  }
  return null;
};

const setCartCache = (cart: CartItem[]) => {
  cartCache = cart;
  cacheTimestamp = Date.now();
};

const loadCartFromStorage = (): CartItem[] => {
  try {
    // Vérifier le cache en mémoire d'abord
    const cached = getCartFromCache();
    if (cached) {
      return cached;
    }

    // Charger depuis localStorage seulement si nécessaire
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const cart = JSON.parse(stored);
      setCartCache(cart);
      return cart;
    }
    return [];
  } catch (error) {
    console.error('Erreur lors du chargement du panier:', error);
    return [];
  }
};

const saveCartToStorage = (cart: CartItem[]) => {
  try {
    // Mettre à jour le cache en mémoire
    setCartCache(cart);
    
    // Sauvegarder en localStorage de manière asynchrone
    setTimeout(() => {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }, 0);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du panier:', error);
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Chargement initial optimisé
  useEffect(() => {
    const initialCart = loadCartFromStorage();
    setCart(initialCart);
    setIsInitialized(true);
  }, []);

  // Sauvegarde optimisée avec debouncing
  useEffect(() => {
    if (isInitialized) {
      saveCartToStorage(cart);
    }
  }, [cart, isInitialized]);

  const addToCart = (productId: string, quantity: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId);
      
      if (existingItem) {
        toast({
          title: "Produit déjà dans le panier",
          description: "Ce produit est déjà dans votre panier.",
        });
        return prevCart;
      }

      const newCart = [...prevCart, { productId, quantity }];
      
      toast({
        title: "Produit ajouté",
        description: "Le produit a été ajouté à votre panier.",
      });
      
      return newCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const newCart = prevCart.filter(item => item.productId !== productId);
      
      toast({
        title: "Produit retiré",
        description: "Le produit a été retiré de votre panier.",
      });
      
      return newCart;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    
    toast({
      title: "Panier vidé",
      description: "Votre panier a été vidé.",
    });
  };

  const isInCart = (productId: string): boolean => {
    return cart.some(item => item.productId === productId);
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Fonction alias pour compatibilité
  const getTotalQuantity = (): number => {
    return getCartTotal();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
        getCartTotal,
        getTotalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
