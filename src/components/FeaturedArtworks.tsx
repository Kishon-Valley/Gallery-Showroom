import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, ShoppingCart, ArrowDown, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ARPreview } from './ARPreview';
import { Artwork } from '../context/AppContext';

interface FeaturedArtworksProps {
  artworks: Artwork[];
}

export const FeaturedArtworks = ({ artworks }: FeaturedArtworksProps) => {
  const { addToCart, addToFavorites } = useAppContext();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showARPreview, setShowARPreview] = useState(false);

  const handleARPreview = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setShowARPreview(true);
  };

  return (
    <>
      {/* Mobile Pull-to-Refresh Indicator */}
      <motion.div
        className="text-center py-4 sm:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
          <ArrowDown className="w-4 h-4 animate-bounce" />
          <span>Pull down to refresh</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {artworks.map((artwork, index) => (
          <motion.div
            key={artwork.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <div className="relative group cursor-pointer">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                className="w-full h-48 sm:h-56 lg:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              
              {/* Mobile Touch Indicator */}
              <div className="absolute top-2 right-2 sm:hidden">
                <div className="bg-black/60 text-white px-2 py-1 rounded-full text-xs">
                  Tap to interact
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex space-x-2 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleARPreview(artwork)}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200 shadow-lg"
                      aria-label="AR Preview"
                    >
                      <Camera className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addToFavorites(artwork.id)}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200 shadow-lg"
                      aria-label="Add to favorites"
                    >
                      <Heart className="w-5 h-5" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addToCart(artwork)}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200 shadow-lg"
                      aria-label="Add to cart"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 sm:p-5 lg:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                {artwork.title}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                by {artwork.artist}
              </p>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ${artwork.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {artwork.medium} • {artwork.year}
                  </p>
                </div>
                
                <Link
                  to={`/gallery`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile Load More Indicator */}
      <motion.div
        className="text-center py-8 sm:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
          <ChevronDown className="w-4 h-4 animate-bounce" />
          <span>Scroll for more artworks</span>
        </div>
      </motion.div>

      {/* AR Preview Modal */}
      {showARPreview && selectedArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full max-w-4xl h-[80vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowARPreview(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <ARPreview artwork={selectedArtwork as Artwork} onClose={() => setShowARPreview(false)} />
          </div>
        </div>
      )}
    </>
  );
}; 