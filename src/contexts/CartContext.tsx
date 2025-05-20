
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number, selectedVariants?: {[key: string]: string}) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalQuantity: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('beshopping-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('beshopping-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId: string, quantity = 1, selectedVariants?: {[key: string]: string}) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // Product exists in cart, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        
        // Update variants if provided
        if (selectedVariants) {
          updatedCart[existingItemIndex].selectedVariants = selectedVariants;
        }
        
        toast({
          title: "Product updated",
          description: "The quantity has been updated in your cart",
        });
        
        return updatedCart;
      } else {
        // Add new item to cart
        toast({
          title: "Product added",
          description: "The product has been added to your cart",
        });
        
        return [...prevCart, { productId, quantity, selectedVariants }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
    toast({
      title: "Product removed",
      description: "The product has been removed from your cart",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => 
      prevCart.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      clearCart,
      getTotalQuantity
    }}>
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
