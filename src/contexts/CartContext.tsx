
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface CartItem {
  id: string;
  name: string;
  original_price: number;
  discounted_price?: number;
  images: string[];
  quantity: number;
  stock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Export alternatif pour compatibilité
export const useCartContext = useCart;

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Charger le panier depuis le localStorage au démarrage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    }
  }, []);

  // Sauvegarder le panier dans le localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: any, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast({
            title: "Stock insuffisant",
            description: `Seulement ${product.stock} articles disponibles`,
            variant: "destructive",
          });
          return prev;
        }
        
        toast({
          title: "Panier mis à jour",
          description: `${product.name} quantité mise à jour`,
        });
        
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        if (quantity > product.stock) {
          toast({
            title: "Stock insuffisant",
            description: `Seulement ${product.stock} articles disponibles`,
            variant: "destructive",
          });
          return prev;
        }
        
        toast({
          title: "Produit ajouté",
          description: `${product.name} ajouté au panier`,
        });
        
        return [...prev, {
          id: product.id,
          name: product.name,
          original_price: product.original_price,
          discounted_price: product.discounted_price,
          images: product.images,
          quantity,
          stock: product.stock,
        }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => {
      const item = prev.find(item => item.id === productId);
      if (item) {
        toast({
          title: "Produit retiré",
          description: `${item.name} retiré du panier`,
        });
      }
      return prev.filter(item => item.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prev =>
      prev.map(item => {
        if (item.id === productId) {
          if (quantity > item.stock) {
            toast({
              title: "Stock insuffisant",
              description: `Seulement ${item.stock} articles disponibles`,
              variant: "destructive",
            });
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: "Panier vidé",
      description: "Tous les articles ont été retirés du panier",
    });
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalAmount = cartItems.reduce((sum, item) => {
    const price = item.discounted_price || item.original_price;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalAmount,
    }}>
      {children}
    </CartContext.Provider>
  );
};
