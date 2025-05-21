import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ARPreview } from './ARPreview';
import { Artwork } from '../context/AppContext';

interface FeaturedArtworksProps {
  artworks: Artwork[];
}

export const FeaturedArtworks = ({ artworks }: FeaturedArtworksProps) => {
  const { addToCart, addToFavorites, isDarkMode } = useAppContext();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showARPreview, setShowARPreview] = useState(false);

  const handleARPreview = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setShowARPreview(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {artworks.map((artwork, index) => (
          <motion.div
            key={artwork.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`rounded-lg overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
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
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Try on wall"
                  >
                    <Camera className="w-5 h-5 text-gray-900" />
                  </button>
                  <button
                    onClick={() => addToFavorites(artwork.id)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Add to favorites"
                  >
                    <Heart className="w-5 h-5 text-gray-900" />
                  </button>
                  <button
                    onClick={() => addToCart(artwork)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="w-5 h-5 text-gray-900" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{artwork.title}</h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{artwork.artist}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">${artwork.price.toLocaleString()}</span>
                <Link
                  to={`/gallery`}
                  className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
                >
                  View Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AR Preview Modal */}
      {showARPreview && selectedArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-lg overflow-hidden">
            <button
              onClick={() => setShowARPreview(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <ARPreview artwork={selectedArtwork} onClose={() => setShowARPreview(false)} />
          </div>
        </div>
      )}
    </>
  );
}; 