import React, { createContext, useContext, useState, useEffect } from 'react';
import { Artwork } from '../types/artwork';
import { supabase } from '../lib/supabase';

export interface AppContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  cart: Artwork[];
  addToCart: (artwork: Artwork) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  isInCart: (id: string) => boolean;
  cartTotal: number;
  favorites: string[];
  addToFavorites: (id: string) => void;
  removeFromFavorites: (id: string) => void;
  isInFavorites: (id: string) => boolean;
  artworks: Artwork[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cart, setCart] = useState<Artwork[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Initialize cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Initialize favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        localStorage.removeItem('favorites');
        setFavorites([]);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Fetch artworks from database
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const { data, error } = await supabase
          .from('artworks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching artworks:', error);
          return;
        }

        if (data) {
          const mappedArtworks = data.map(item => ({
            id: item.id,
            title: item.title,
            artist: item.artist,
            description: item.description,
            price: item.price,
            imageUrl: item.imageUrl || item.image_url || 'https://via.placeholder.com/300x300?text=No+Image',
            dimensions: item.dimensions,
            medium: item.medium,
            year: item.year,
            category: item.category,
            featured: item.featured,
            quantity: item.quantity
          }));
          setArtworks(mappedArtworks);
        }
      } catch (error) {
        console.error('Error in fetchArtworks:', error);
      }
    };

    fetchArtworks();

    // Subscribe to changes in the artworks table
    const subscription = supabase
      .channel('artworks-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'artworks' }, 
        () => {
          fetchArtworks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const addToCart = (artwork: Artwork) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === artwork.id);
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        const currentQuantity = updatedCart[existingItemIndex].quantity || 1;
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: currentQuantity + 1
        };
        return updatedCart;
      } else {
        return [...prevCart, { ...artwork, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id));
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const isInCart = (id: string) => {
    return cart.some(item => item.id === id);
  };

  const cartTotal = cart.reduce((total, item) => {
    return total + (item.price * (item.quantity || 1));
  }, 0);

  const addToFavorites = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prev => prev.filter(itemId => itemId !== id));
  };

  const isInFavorites = (id: string) => {
    return favorites.includes(id);
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        isInCart,
        cartTotal,
        favorites,
        addToFavorites,
        removeFromFavorites,
        isInFavorites,
        artworks
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 