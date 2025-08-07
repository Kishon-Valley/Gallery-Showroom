import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Favorites = () => {
  const { favorites, removeFromFavorites, addToCart, artworks, artworksLoading } = useAppContext();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Filter artworks to only show favorited ones
  const favoriteArtworks = artworks.filter(artwork => favorites.includes(artwork.id));

  const handleAddToCart = (artworkId: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    const artwork = artworks.find(a => a.id === artworkId);
    if (artwork) {
      addToCart(artwork);
    }
  };

  const handleSignIn = () => {
    navigate('/signin', { 
      state: { 
        from: '/favorites',
        message: 'Sign in to add items to your cart'
      } 
    });
    setShowAuthModal(false);
  };

  const handleSignUp = () => {
    navigate('/signup', { 
      state: { 
        from: '/favorites',
        message: 'Create an account to add items to your cart'
      } 
    });
    setShowAuthModal(false);
  };

  if (artworksLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-red-500 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">No favorites yet</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Start browsing the gallery and add your favorite artworks to this collection.
            </p>
            <button
              onClick={() => navigate('/gallery')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Browse Gallery
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Your Favorites</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="rounded-lg overflow-hidden shadow-sm bg-white dark:bg-gray-800"
            >
              <div className="relative group">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleAddToCart(artwork.id)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="w-5 h-5 text-gray-900" />
                    </button>
                    <button
                      onClick={() => removeFromFavorites(artwork.id)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Remove from favorites"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </div>
                </div>
                <div className="absolute top-2 right-2">
                  <Heart className="w-6 h-6 text-red-500 fill-current" />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{artwork.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{artwork.artist}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {artwork.dimensions}
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    ${artwork.price.toLocaleString()}
                  </p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                  {artwork.description.substring(0, 80)}
                  {artwork.description.length > 80 ? '...' : ''}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg shadow-xl w-full max-w-md p-6 bg-white dark:bg-gray-800"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add to Cart</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              You need to be signed in to add items to your cart. Please sign in or create an account to continue.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => setShowAuthModal(false)}
                className="py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
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