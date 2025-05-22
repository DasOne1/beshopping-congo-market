
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define cart item structure
export interface CartItem {
  productId: string;
  quantity: number;
  selectedVariants?: Record<string, string>;
}

// Define cart context shape
interface CartContextType {
  cart: CartItem[];
  cartItems: CartItem[]; // Add this line to fix the error
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
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  // Add item to cart or update quantity if already exists
  const addToCart = (productId: string, quantity: number, selectedVariants?: Record<string, string>) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === productId);
      
      if (existingItem) {
        // Update existing item
        return prevCart.map(item => 
          item.productId === productId 
            ? { ...item, 
                quantity: item.quantity + quantity,
                selectedVariants: selectedVariants || item.selectedVariants 
              } 
            : item
        );
      } else {
        // Add new item
        return [...prevCart, { productId, quantity, selectedVariants }];
      }
    });
  };
  
  // Remove item from cart
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };
  
  // Update quantity of item in cart
  const updateQuantity = (productId: string, quantity: number) => {
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
  
  return (
    <CartContext.Provider value={{ 
      cart, 
      cartItems: cart, // Add this line to fix the error
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      updateVariant,
      isInCart,
      getTotalQuantity
    }}>
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
