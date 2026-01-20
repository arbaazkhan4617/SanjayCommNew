import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const loadCart = async () => {
    if (!user?.id) {
      // Load from local storage if not logged in
      try {
        const cartData = await AsyncStorage.getItem('cart');
        if (cartData) {
          setCartItems(JSON.parse(cartData));
        }
      } catch (e) {
        console.error('Error loading local cart:', e);
      }
      return;
    }
    
    try {
      setLoading(true);
      const response = await cartAPI.getCart(user.id);
      const items = response.data.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: parseFloat(item.product.price),
        originalPrice: item.product.originalPrice ? parseFloat(item.product.originalPrice) : null,
        image: item.product.image || item.product.model?.image || 'https://via.placeholder.com/300x300?text=Product',
        quantity: item.quantity,
        product: item.product,
      }));
      setCartItems(items);
      // Also save to local storage as backup
      await AsyncStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error loading cart from server:', error.message);
      // Fallback to local storage if API fails
      try {
        const cartData = await AsyncStorage.getItem('cart');
        if (cartData) {
          const localItems = JSON.parse(cartData);
          setCartItems(localItems);
          console.log('Loaded cart from local storage');
        }
      } catch (e) {
        console.error('Error loading local cart:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!user?.id) {
      // Fallback to local storage if not logged in
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevItems, { ...product, quantity }];
      });
      return;
    }

    try {
      await cartAPI.addToCart(user.id, product.id, quantity);
      await loadCart(); // Reload cart from server
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Fallback to local storage
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id);
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...prevItems, { ...product, quantity }];
      });
    }
  };

  const removeFromCart = async (productId) => {
    if (!user?.id) {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
      return;
    }

    // Find cart item ID
    const cartItem = cartItems.find(item => item.id === productId);
    if (!cartItem) return;

    try {
      // We need the cartItemId from backend, for now use productId
      // In a real scenario, you'd store cartItemId
      await loadCart(); // Reload to get proper IDs
      const updatedCart = cartItems.filter(item => item.id !== productId);
      setCartItems(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (!user?.id) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
      return;
    }

    try {
      // Find cart item - in real app, you'd have cartItemId
      const cartItem = cartItems.find(item => item.id === productId);
      if (cartItem && cartItem.cartItemId) {
        await cartAPI.updateCartItem(user.id, cartItem.cartItemId, quantity);
        await loadCart();
      } else {
        // Fallback to local update
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          )
        );
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (!user?.id) {
      setCartItems([]);
      return;
    }

    try {
      await cartAPI.clearCart(user.id);
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setCartItems([]);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 0), 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    refreshCart: loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
