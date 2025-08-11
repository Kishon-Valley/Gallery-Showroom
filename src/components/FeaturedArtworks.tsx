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
  const { addToCart, addToFavorites } = useAppContext();
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showARPreview, setShowARPreview] = useState(false);

  const handleARPreview = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setShowARPreview(true);
  };

  return (
    <>
      {/* Mobile: horizontal carousel */}
      <div className="md:hidden -mx-4 px-4">
        <div className="flex space-x-4 overflow-x-auto snap-x snap-mandatory pb-2 no-scrollbar">
          {artworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.12 }}
              className="snap-center min-w-[80%] shrink-0 rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            >
              <div className="relative">
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  loading="lazy"
                  className="w-full aspect-[4/5] object-cover"
                />
                {/* Bottom action bar for better touch targets */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleARPreview(artwork)}
                    className="flex-1 py-2 rounded-lg bg-white/90 dark:bg-gray-900/80 text-gray-900 dark:text-white text-sm font-medium shadow backdrop-blur hover:bg-white"
                    aria-label="Try on wall"
                  >
                    AR Preview
                  </button>
                  <button
                    onClick={() => addToFavorites(artwork.id)}
                    className="p-2 rounded-lg bg-white/90 dark:bg-gray-900/80 text-gray-900 dark:text-white shadow hover:bg-white"
                    aria-label="Add to favorites"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => addToCart(artwork)}
                    className="p-2 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700"
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-semibold mb-1 text-gray-900 dark:text-white line-clamp-1">{artwork.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-1">{artwork.artist}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">${artwork.price.toLocaleString()}</p>
                  <Link to="/gallery" className="text-sm text-blue-600 dark:text-blue-400 font-medium">View</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop / tablet: grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-8">
        {artworks.map((artwork, index) => (
          <motion.div
            key={artwork.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.15 }}
            className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
          >
            <div className="relative group">
              <img
                src={artwork.imageUrl}
                alt={artwork.title}
                loading="lazy"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
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
              <h3 className="text-lg md:text-xl font-semibold mb-2 text-gray-900 dark:text-white">{artwork.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{artwork.artist}</p>
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  ${artwork.price.toLocaleString()}
                </p>
                <Link
                  to={`/gallery`}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
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
          <div className="relative w-full max-w-4xl h-[80vh] bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowARPreview(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md"
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
 