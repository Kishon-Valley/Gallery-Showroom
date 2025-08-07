import { motion } from 'framer-motion';
import { ArrowRight, Palette, Camera, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FeaturedArtworks } from '../components/FeaturedArtworks';
import { supabase } from '../lib/supabase';
import { Artwork as DbArtwork } from '../types/artwork';
import { Artwork as FrontendArtwork } from '../context/AppContext';

// Import the columbine flower image
import columbineImage from '../img/image2.jpg';

export const Home = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState<FrontendArtwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeaturedArtworks();
  }, []);

  const fetchFeaturedArtworks = async () => {
    try {
      setLoading(true);
      // First try to fetch artworks marked as featured
      let { data, error } = await supabase
        .from('artworks')
        .select('*')
        .eq('featured', true)
        .limit(3);

      // If no featured artworks or error, fetch the most recent ones
      if (error || !data || data.length === 0) {
        console.log('No featured artworks found, fetching recent ones');
        const { data: recentData, error: recentError } = await supabase
          .from('artworks')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (recentError) throw recentError;
        data = recentData;
      }

      // Map database fields to component expected fields
      const mappedArtworks = data?.map((artwork: DbArtwork) => ({
        id: artwork.id,
        title: artwork.title,
        artist: artwork.artist,
        description: artwork.description,
        price: artwork.price,
        imageUrl: artwork.imageUrl,
        dimensions: artwork.dimensions,
        medium: artwork.medium,
        year: artwork.year,
        quantity: artwork.quantity
      })) || [];

      setFeaturedArtworks(mappedArtworks);
    } catch (error: any) {
      console.error('Error fetching featured artworks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200 dark:bg-purple-800 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-200 dark:bg-pink-800 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-purple-800 to-blue-600 dark:from-white dark:via-purple-200 dark:to-blue-200 bg-clip-text text-transparent"
              >
                Discover
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-300 dark:to-purple-400">
                  Exceptional Art
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0"
              >
                Curated collection of contemporary masterpieces from world-renowned artists, 
                bringing Brazilian artistry to the world.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link to="/gallery">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full font-medium flex items-center space-x-2 mx-auto lg:mx-0 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span>Explore Gallery</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                
                <Link to="/ar-preview">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-full font-medium flex items-center space-x-2 mx-auto lg:mx-0 border-2 border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Try AR Preview</span>
                  </motion.button>
                </Link>
              </motion.div>

              {/* Feature Icons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex justify-center lg:justify-start space-x-8 mt-12"
              >
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Palette className="w-5 h-5" />
                  <span className="text-sm">Original Artworks</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">Curated Collection</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-sm">Secure Checkout</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Line Cover Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative w-full max-w-md mx-auto">
                {/* Main Image */}
                <motion.div
                  initial={{ scale: 0.8, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="relative"
                >
                  <img
                    src={columbineImage}
                    alt="Columbine Flower - Line Cover Artwork"
                    className="w-full h-auto rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                  />
                  
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-80 animate-pulse"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full opacity-60"></div>
                  <div className="absolute top-1/2 -left-6 w-4 h-4 bg-purple-400 rounded-full opacity-70"></div>
                </motion.div>

                {/* Floating Info Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Columbine Flower</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Oil on Canvas</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2"
            ></motion.div>
          </div>
        </motion.div>
      </section>

      {/* Featured Artworks Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-purple-600 dark:from-white dark:to-purple-300 bg-clip-text text-transparent">
              Featured Artworks
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover our handpicked selection of exceptional pieces that represent
              the pinnacle of contemporary artistic expression.
            </p>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-600 dark:text-red-400">
              <p>Error loading artworks. Please try again later.</p>
            </div>
          ) : featuredArtworks.length === 0 ? (
            <div className="text-center py-10 text-gray-600 dark:text-gray-300">
              <p>No artworks found. Check back soon for our curated collection.</p>
            </div>
          ) : (
            <FeaturedArtworks artworks={featuredArtworks} />
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-16"
          >
            <Link to="/gallery">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 rounded-full font-medium inline-flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>View All Artworks</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};