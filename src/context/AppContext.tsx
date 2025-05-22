import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the Artwork type with quantity
export interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: number;
  imageUrl: string;
  dimensions?: string;
  medium?: string;
  year?: string;
  quantity?: number;
}

// Sample artwork data
const artworkData: Artwork[] = [
  {
    id: '1',
    title: 'Sunset Horizon',
    artist: 'Emma Johnson',
    description: 'A vibrant depiction of a sunset over calm waters, with rich oranges and purples reflecting on the surface.',
    price: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    dimensions: '24" x 36"',
    medium: 'Oil on canvas',
    year: '2022'
  },
  {
    id: '2',
    title: 'Urban Rhythm',
    artist: 'Marcus Chen',
    description: 'An abstract representation of city life, with geometric shapes and bold colors creating a sense of movement and energy.',
    price: 950,
    imageUrl: 'https://images.unsplash.com/photo-1549887552-cb1071d3e5ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=765&q=80',
    dimensions: '30" x 30"',
    medium: 'Acrylic on canvas',
    year: '2021'
  },
  {
    id: '3',
    title: 'Serene Forest',
    artist: 'Olivia Martinez',
    description: 'A peaceful forest scene with sunlight filtering through the trees, creating a sense of tranquility and harmony with nature.',
    price: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1518021964703-4b2030f03085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    dimensions: '36" x 48"',
    medium: 'Oil on canvas',
    year: '2023'
  },
  {
    id: '4',
    title: 'Coastal Dreams',
    artist: 'James Wilson',
    description: 'A dreamy coastal landscape with soft waves crashing against rocky shores, evoking a sense of nostalgia and longing.',
    price: 1100,
    imageUrl: 'https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    dimensions: '24" x 36"',
    medium: 'Watercolor on paper',
    year: '2022'
  }
];

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
  const [artworks] = useState<Artwork[]>(artworkData);

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
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const addToCart = (artwork: Artwork) => {
    setCart(prevCart => {
      // Check if the artwork is already in the cart
      const existingItemIndex = prevCart.findIndex(item => item.id === artwork.id);
      
      if (existingItemIndex >= 0) {
        // If it exists, update the quantity
        const updatedCart = [...prevCart];
        const currentQuantity = updatedCart[existingItemIndex].quantity || 1;
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: currentQuantity + 1
        };
        return updatedCart;
      } else {
        // If it doesn't exist, add it with quantity 1
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