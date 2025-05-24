import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Video } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Artwork } from '../types/artwork';

// Import local images
import image1 from '../img/image1.jpg';
import image2 from '../img/image2.jpg';
import image3 from '../img/image3.jpg';
import image4 from '../img/image4.jpg';

// Fallback artwork data in case database fetch fails
const fallbackArtworks = [
  {
    id: "1",
    title: 'Vibrant Abstraction',
    imageUrl: image1,
    artist: 'You',
    dimensions: '24" x 36"',
    medium: 'Acrylic on Canvas',
    price: 1200,
    description: 'A vibrant abstract painting with bold colors and dynamic composition.'
  },
  {
    id: "2",
    title: 'Serene Landscape',
    imageUrl: image2,
    artist: 'You',
    dimensions: '30" x 40"',
    medium: 'Oil on Canvas',
    price: 1800,
    description: 'A peaceful landscape depicting rolling hills and a calm lake at sunset.'
  },
  {
    id: "3",
    title: 'Emotional Expression',
    imageUrl: image3,
    artist: 'You',
    dimensions: '18" x 24"',
    medium: 'Mixed Media',
    price: 950,
    description: 'An expressive piece that conveys deep emotion through texture and color.'
  },
  {
    id: "4",
    title: 'Modern Composition',
    imageUrl: image4,
    artist: 'You',
    dimensions: '24" x 24"',
    medium: 'Mixed Media',
    price: 1100,
    description: 'A modern composition with geometric elements and a balanced color palette.'
  }
];

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
  useEffect(() => {
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
          setArtworks(fallbackArtworks as unknown as Artwork[]);
        } else if (data && data.length > 0) {
          console.log('Fetched artworks from database:', data);
          // Map database fields to expected format
          const mappedArtworks = data.map(item => ({
            id: item.id,
            title: item.title,
            artist: item.artist,
            description: item.description,
            price: item.price,
            imageUrl: item.image_url || 'https://via.placeholder.com/300x300?text=No+Image',
            dimensions: item.dimensions,
            medium: item.medium,
            year: item.year,
            category: item.category,
            featured: item.featured,
            quantity: item.quantity
          }));
          setArtworks(mappedArtworks);
          setError(null);
        } else {
          console.log('No artworks found in database, using fallback data');
          setArtworks(fallbackArtworks as unknown as Artwork[]);
        }
      } catch (err) {
        console.error('Error in fetchArtworks:', err);
        setError('An unexpected error occurred');
        setArtworks(fallbackArtworks as unknown as Artwork[]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtworks();
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

  const handleSignUp = () => {
    navigate('/signup', { 
      state: { 
        from: '/gallery',
        message: authModalAction === 'cart' 
          ? 'Create an account to add items to your cart' 
          : 'Create an account to add items to your favorites'
      } 
    });
    setShowAuthModal(false);
  };

  return (
    <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Art Gallery</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                onMouseLeave={() => {
                  setHoveredArtwork(null);
                  setShowARTooltip(null);
                }}
              >
                <div className="relative h-64">
                  <img 
                    src={artwork.imageUrl} 
                    alt={artwork.title} 
                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
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
                      <div className="relative">
                        <button
                          onClick={() => handleARPreview(artwork.id)}
                          onMouseEnter={() => setShowARTooltip(artwork.id)}
                          onMouseLeave={() => setShowARTooltip(null)}
                          className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-colors"
                          aria-label="View in AR with camera"
                        >
                          <Video className="w-5 h-5" />
                        </button>
                        {showARTooltip === artwork.id && (
                          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                            Try on your wall with camera
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-lg font-semibold">
                      ${artwork.price.toLocaleString()}
                    </p>
                    {artwork.dimensions && (
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {artwork.dimensions}
                      </p>
                    )}
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {artwork.description.substring(0, 100)}
                    {artwork.description.length > 100 ? '...' : ''}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      
      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-lg shadow-xl w-full max-w-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <h2 className="text-xl font-bold mb-4">
              {authModalAction === 'cart' ? 'Add to Cart' : 'Add to Favorites'}
            </h2>
            <p className="mb-4">
              You need to be signed in to {authModalAction === 'cart' ? 'add items to your cart' : 'save favorites'}. 
              Please sign in or create an account to continue.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => setShowAuthModal(false)}
                className={`py-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSignIn}
                className="py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign In
              </button>
              <button
                onClick={handleSignUp}
                className="py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white"
              >
                Create Account
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};