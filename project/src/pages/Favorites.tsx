import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Camera } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Artwork } from '../types/artwork';

export const Favorites = () => {
  const { favorites, removeFromFavorites, addToCart, isDarkMode } = useAppContext();
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  const [favoriteArtworks, setFavoriteArtworks] = useState<Artwork[]>([]);
  const [loadingArtworks, setLoadingArtworks] = useState(true);
  
  // Fetch favorite artworks from Supabase when favorites change
  useEffect(() => {
    const fetchFavoriteArtworks = async () => {
      console.log('Current favorites in state:', favorites);
      
      if (favorites.length === 0) {
        console.log('No favorites found, clearing artwork list');
        setFavoriteArtworks([]);
        setLoadingArtworks(false);
        return;
      }
      
      try {
        setLoadingArtworks(true);
        console.log('Fetching favorite artworks with IDs:', favorites);
        
        const { data, error } = await supabase
          .from('artworks')
          .select('*')
          .in('id', favorites);
          
        console.log('Supabase query result:', { data, error });
        
        if (error) {
          console.error('Error fetching favorite artworks:', error);
          setFavoriteArtworks([]);
        } else if (data) {
          console.log('Successfully fetched artwork data:', data);
          // Map the database fields to the Artwork interface
          const artworks: Artwork[] = data.map(item => ({
            id: item.id,
            title: item.title,
            artist: item.artist,
            description: item.description,
            price: item.price,
            imageUrl: item.imageUrl || item.image_url || 'https://via.placeholder.com/300x300?text=No+Image',
            dimensions: item.dimensions,
            medium: item.medium,
            year: item.year,
            featured: item.featured,
            category: item.category,
            quantity: item.quantity
          }));
          console.log('Mapped artworks to display:', artworks);
          setFavoriteArtworks(artworks);
        }
      } catch (error) {
        console.error('Error in fetchFavoriteArtworks:', error);
      } finally {
        setLoadingArtworks(false);
      }
    };
    
    fetchFavoriteArtworks();
  }, [favorites]);
  
  // Redirect if not authenticated (handled by ProtectedRoute in App.tsx)
  // This is just a fallback
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/signin', { state: { from: { pathname: '/favorites' } } });
    }
  }, [isAuthenticated, loading, navigate]);
  
  const handleRemoveFromFavorites = (id: string) => {
    removeFromFavorites(id);
  };
  
  const handleAddToCart = (artwork: any) => {
    addToCart(artwork);
  };
  
  if (loading || loadingArtworks) {
    return (
      <div className={`min-h-screen pt-20 flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Favorites</h1>

        {favoriteArtworks.length === 0 ? (
          <div className={`text-center py-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
            <p className="text-xl mb-4">You haven't added any favorites yet</p>
            <a href="/gallery" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Browse Gallery
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteArtworks.map(artwork => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`rounded-lg overflow-hidden shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="relative h-64">
                  <img 
                    src={artwork.imageUrl} 
                    alt={artwork.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-t from-black/70 to-transparent">
                    <div>
                      <h3 className="text-white font-medium">{artwork.title}</h3>
                      <p className="text-gray-300 text-sm">{artwork.artist}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRemoveFromFavorites(artwork.id)}
                        className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                        aria-label="Remove from favorites"
                      >
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                      <button
                        onClick={() => handleAddToCart(artwork)}
                        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                        aria-label="Add to cart"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => navigate(`/ar-preview/${artwork.id}`)}
                        className="p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                        aria-label="View in AR"
                      >
                        <Camera className="w-5 h-5" />
                      </button>
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
                    {artwork.description?.substring(0, 100)}
                    {artwork.description && artwork.description.length > 100 ? '...' : ''}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 