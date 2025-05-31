
import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';

// Define cart item structure
export interface CartItem {
  productId: string;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

// Define cart context shape
interface CartContextType {
  cart: CartItem[];
  cartItems: CartItem[];
  addToCart: (productId: string, quantity: number, selectedVariants?: Record<string, string>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  updateVariant: (productId: string, selectedVariants: Record<string, string>) => void;
  isInCart: (productId: string) => boolean;
  getTotalQuantity: () => number;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Initialize cart state from localStorage if available
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Erreur lors du chargement du panier depuis localStorage:', error);
      return [];
    }
  });
  
  // Save cart to localStorage whenever it changes with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Panier sauvegardé dans localStorage:', cart.length, 'articles');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde du panier:', error);
      }
    }, 300); // Debounce pour éviter trop d'écritures

    return () => clearTimeout(timeoutId);
  }, [cart]);
  
  // Add item to cart or update quantity if already exists
  const addToCart = (productId: string, quantity: number, selectedVariants?: Record<string, string>) => {
    console.log('Ajout au panier:', { productId, quantity, selectedVariants });
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId);
      
      if (existingItem) {
        // Update existing item
        const updatedCart = prevCart.map(item => 
          item.productId === productId 
            ? { ...item, 
                quantity: item.quantity + quantity,
                selectedVariants: selectedVariants || item.selectedVariants 
              } 
            : item
        );
        console.log('Article mis à jour dans le panier');
        return updatedCart;
      } else {
        // Add new item
        const newCart = [...prevCart, { productId, quantity, selectedVariants }];
        console.log('Nouvel article ajouté au panier');
        return newCart;
      }
    });
  };
  
  // Remove item from cart
  const removeFromCart = (productId: string) => {
    console.log('Suppression du panier:', productId);
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };
  
  // Update quantity of item in cart
  const updateQuantity = (productId: string, quantity: number) => {
    console.log('Mise à jour quantité:', { productId, quantity });
    
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
  
  // Update variant selections for an item
  const updateVariant = (productId: string, selectedVariants: Record<string, string>) => {
    console.log('Mise à jour variantes:', { productId, selectedVariants });
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId
          ? { ...item, selectedVariants }
          : item
      )
    );
  };
  
  // Clear the entire cart
  const clearCart = () => {
    console.log('Panier vidé');
    setCart([]);
  };
  
  // Check if product is in cart
  const isInCart = (productId: string) => {
    return cart.some(item => item.productId === productId);
  };
  
  // Get total quantity of items in cart
  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    cart,
    cartItems: cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    updateVariant,
    isInCart,
    getTotalQuantity
  }), [cart]);
  
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
