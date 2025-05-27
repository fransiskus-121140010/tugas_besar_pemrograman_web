// src/contexts/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const CART_STORAGE_KEY = 'minervaProAudioCart';

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

const getInitialCartState = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (storedCart) {
      return JSON.parse(storedCart);
    }
  } catch (error) {
    console.error("Error parsing stored cart:", error);
    localStorage.removeItem(CART_STORAGE_KEY); // Clear corrupted cart
  }
  return []; // Default to empty cart
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getInitialCartState);

  // Save to localStorage whenever cartItems change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      console.log('[CartContext-LS] Cart saved to localStorage:', cartItems);
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    // console.log(`[CartContext-LS] "${product.name}" added to cart.`); // Logging now in useEffect
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      return prevItems.filter(item => item.id !== productId);
    });
    // console.log(`[CartContext-LS] Product with ID: ${productId} removed from cart.`);
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems => {
      if (newQuantity < 1) {
        newQuantity = 1;
        // console.log(`[CartContext-LS] Quantity for product ID: ${productId} cannot be less than 1. Setting to 1.`);
      }
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
    // console.log(`[CartContext-LS] Quantity for product ID: ${productId} updated to ${newQuantity}.`);
  };

  const clearCart = () => {
    setCartItems([]);
    // console.log('[CartContext-LS] Cart cleared.');
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}