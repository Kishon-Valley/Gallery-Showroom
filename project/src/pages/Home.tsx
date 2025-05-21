import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FeaturedArtworks } from '../components/FeaturedArtworks';
import { artworks } from '../data/artworks';

export const Home = () => {
  // Take only the first three artworks for featured section
  const featuredThree = artworks.slice(0, 3);

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1577720580479-7d839d829c73?auto=format&fit=crop&q=80"
            alt="Gallery Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Discover Exceptional Art
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
          >
            Curated collection of contemporary masterpieces from world-renowned artists
          </motion.p>
          <Link to="/gallery">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-white text-black px-8 py-3 rounded-full font-medium flex items-center space-x-2 mx-auto hover:bg-gray-100 transition-colors"
            >
              <span>Explore Gallery</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Featured Artworks Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Artworks</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of exceptional pieces that represent
              the pinnacle of contemporary artistic expression.
            </p>
          </motion.div>
          <FeaturedArtworks artworks={featuredThree} />
          <div className="text-center mt-12">
            <Link to="/gallery">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white px-8 py-3 rounded-full font-medium inline-flex items-center space-x-2 hover:bg-gray-800 transition-colors"
              >
                <span>View All Artworks</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};