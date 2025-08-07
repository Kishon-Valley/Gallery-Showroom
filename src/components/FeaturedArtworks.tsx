import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, ShoppingCart } from 'lucide-react';
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork, index) => (
          <motion.div
            key={artwork.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800"
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
                    onClick={() => handleARPreview(artwork)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
                    aria-label="Try on wall with camera"
                  >
                    <Camera className="w-5 h-5 text-gray-900 dark:text-white" />
                  </button>
                  <button
                    onClick={() => addToFavorites(artwork.id)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
                    aria-label="Add to favorites"
                  >
                    <Heart className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  ${artwork.price.toLocaleString()}
                </p>
                {artwork.dimensions && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {artwork.dimensions}
                  </p>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">{artwork.title}</h3>
              <p className="text-gray-600 mb-3 dark:text-gray-300">{artwork.artist}</p>
              <button
                onClick={() => addToCart(artwork)}
                className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AR Preview Modal */}
      {showARPreview && selectedArtwork && (
        <ARPreview 
          artwork={selectedArtwork} 
          onClose={() => setShowARPreview(false)} 
        />
      )}
    </>
  );
}; 