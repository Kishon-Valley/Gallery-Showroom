import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Video } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Artwork } from '../types/artwork';

export const Gallery = () => {
  const { 
    addToCart, 
    isInCart, 
    addToFavorites, 
    removeFromFavorites, 
    isInFavorites, 
    isDarkMode 
  } = useAppContext();
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [hoveredArtwork, setHoveredArtwork] = useState<string | null>(null);
  const [showARTooltip, setShowARTooltip] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalAction, setAuthModalAction] = useState<'cart' | 'favorite'>('cart');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch artworks from Supabase
  const fetchArtworks = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching artworks:', error);
        setError('Failed to load artworks');
        setArtworks([]);
      } else if (data && data.length > 0) {
        console.log('Fetched artworks from database:', data);
        // Map database fields to expected format
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
        console.log('Mapped artworks:', mappedArtworks);
        setArtworks(mappedArtworks);
        setError(null);
      } else {
        console.log('No artworks found in database');
        setArtworks([]);
      }
    } catch (err) {
      console.error('Error in fetchArtworks:', err);
      setError('An unexpected error occurred');
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Set up Supabase realtime subscription
  useEffect(() => {
    fetchArtworks();
    
    // Subscribe to changes in the artworks table
    const subscription = supabase
      .channel('artworks-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'artworks' }, 
        (payload) => {
          console.log('Realtime update received:', payload);
          // Refresh the artwork list when any change occurs
          fetchArtworks();
        }
      )
      .subscribe();
    
    // Cleanup subscription when component unmounts
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleAddToCart = (artworkId: string) => {
    if (!isAuthenticated) {
      setAuthModalAction('cart');
      setShowAuthModal(true);
      return;
    }
    
    const artwork = artworks.find(a => a.id === artworkId);
    if (artwork) {
      addToCart(artwork);
    }
  };

  const handleFavoriteToggle = (artworkId: string) => {
    if (!isAuthenticated) {
      setAuthModalAction('favorite');
      setShowAuthModal(true);
      return;
    }
    
    if (isInFavorites(artworkId)) {
      removeFromFavorites(artworkId);
    } else {
      addToFavorites(artworkId);
    }
  };

  const handleARPreview = (artworkId: string) => {
    navigate(`/ar-preview/${artworkId}`);
  };

  const handleSignIn = () => {
    navigate('/signin', { 
      state: { 
        from: '/gallery',
        message: authModalAction === 'cart' 
          ? 'Sign in to add items to your cart' 
          : 'Sign in to add items to your favorites'
      } 
    });
    setShowAuthModal(false);
  };

  if (loading) {
    return (
      <div className={`min-h-screen pt-20 flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Error Loading Artworks</h2>
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchArtworks}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Gallery</h1>
        
        {artworks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl mb-4">No artworks available at the moment.</p>
            <p className="text-gray-500">Check back soon for new additions to our collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map(artwork => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-lg overflow-hidden shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                onMouseEnter={() => setHoveredArtwork(artwork.id)}
                onMouseLeave={() => setHoveredArtwork(null)}
              >
                <div className="relative h-64">
                  <img 
                    src={artwork.imageUrl} 
                    alt={artwork.title} 
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent flex justify-between items-center transition-opacity duration-300 ${
                      hoveredArtwork === artwork.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div>
                      <h3 className="text-white font-medium">{artwork.title}</h3>
                      <p className="text-gray-300 text-sm">{artwork.artist}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleFavoriteToggle(artwork.id)}
                        className={`p-2 rounded-full ${
                          isAuthenticated && isInFavorites(artwork.id) 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-gray-700 hover:bg-gray-600'
                        } text-white transition-colors`}
                        aria-label={isAuthenticated && isInFavorites(artwork.id) ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart className={`w-5 h-5 ${isAuthenticated && isInFavorites(artwork.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleAddToCart(artwork.id)}
                        className={`p-2 rounded-full ${
                          isAuthenticated && isInCart(artwork.id) 
                            ? 'bg-green-500 hover:bg-green-600' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        } text-white transition-colors`}
                        aria-label={isAuthenticated && isInCart(artwork.id) ? "Added to cart" : "Add to cart"}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleARPreview(artwork.id)}
                        className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                        aria-label="View in AR"
                        onMouseEnter={() => setShowARTooltip(artwork.id)}
                        onMouseLeave={() => setShowARTooltip(null)}
                      >
                        <Video className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium mb-1">{artwork.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{artwork.artist}</p>
                  <p className="font-medium">${artwork.price.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-xl max-w-md w-full mx-4`}>
            <h2 className="text-xl font-bold mb-4">Sign In Required</h2>
            <p className="mb-6">
              {authModalAction === 'cart' 
                ? 'Please sign in to add items to your cart.' 
                : 'Please sign in to add items to your favorites.'}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAuthModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSignIn}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};