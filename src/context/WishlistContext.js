import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { wishlistAPI } from '../services/api';

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) return { wishlistIds: new Set(), add: () => {}, remove: () => {}, isInWishlist: () => false, refresh: () => {}, wishlist: [] };
  return ctx;
};

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setWishlist([]);
      return;
    }
    try {
      setLoading(true);
      const res = await wishlistAPI.getWishlist(user.id);
      setWishlist(Array.isArray(res.data) ? res.data : []);
    } catch {
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (productId) => {
      if (!user?.id) return false;
      try {
        await wishlistAPI.add(user.id, productId);
        await refresh();
        return true;
      } catch {
        return false;
      }
    },
    [user?.id, refresh]
  );

  const remove = useCallback(
    async (productId) => {
      if (!user?.id) return;
      try {
        await wishlistAPI.remove(user.id, productId);
        await refresh();
      } catch {}
    },
    [user?.id, refresh]
  );

  const isInWishlist = useCallback(
    (productId) => wishlist.some((p) => p.id === productId),
    [wishlist]
  );

  const wishlistIds = new Set(wishlist.map((p) => p.id));

  return (
    <WishlistContext.Provider
      value={{ wishlist, wishlistIds, add, remove, isInWishlist, refresh, loading }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
