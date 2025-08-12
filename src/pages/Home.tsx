import { motion } from 'framer-motion';
import { ArrowRight, Palette, Camera, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FeaturedArtworks } from '../components/FeaturedArtworks';
import { supabase } from '../lib/supabase';
import { Artwork as DbArtwork } from '../types/artwork';
import { Artwork as FrontendArtwork } from '../context/AppContext';

// Import hero images
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
        <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-gray-200 dark:bg-gray-800 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gray-200 dark:bg-gray-800 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left order-2 lg:order-1"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hidden lg:block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl hero-title mb-4 lg:mb-6 text-gray-900 dark:text-white leading-tight"
              >
                Home,
                <br />
                <span className="text-gradient">
                  To Exceptional Arts
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg sm:text-xl lg:text-2xl mb-6 lg:mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed hero-subtitle"
              >
                a collection of inspiring and beautiful arts from an inspired artist, 
                bringing out the nature of life and emotions through artworks to the world.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 lg:gap-4 justify-center lg:justify-start"
              >
                <Link to="/gallery">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium flex items-center justify-center space-x-2 mx-auto lg:mx-0 transition-colors duration-200 w-full sm:w-auto"
                  >
                    <span>Explore Gallery</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </Link>
                
                <Link to="/ar-preview">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium flex items-center justify-center space-x-2 mx-auto lg:mx-0 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200 w-full sm:w-auto"
                  >
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Try AR Preview</span>
                  </motion.button>
                </Link>
              </motion.div>

              {/* Feature Icons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-8 mt-8 lg:mt-12"
              >
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">Original Artworks</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">Curated Collection</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">Secure Checkout</span>
                </div>
              </motion.div>
            </motion.div>

              {/* Hero Image with Creative Shape */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative order-1 lg:order-2 mb-8 lg:mb-0"
            >
              <div className="relative w-full max-w-sm sm:max-w-md mx-auto">
                {/* Creative Shape Container */}
                <motion.div
                  initial={{ scale: 0.95, rotate: -2 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="relative"
                >
                  {/* Background Shape */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-[50px] transform rotate-3 scale-105 opacity-20"></div>
                  
                  {/* Main Image with Creative Shape */}
                  <div className="relative rounded-[40px] overflow-hidden shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                    <img
                      src={columbineImage}
                      alt="Columbine Flower - Line Cover Artwork"
                      className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Shape Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-[40px]"></div>

                    {/* Mobile-only headline overlay inside hero image */}
                    <div className="absolute inset-0 flex items-center justify-center lg:hidden px-4">
                      <div className="text-center">
                        <h1 className="text-white text-3xl sm:text-4xl font-extrabold leading-tight drop-shadow-md">
                          Home,
                          <br />
                          <span className="text-white">To Exceptional Arts</span>
                        </h1>
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative Shape Elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 sm:w-12 sm:h-12 bg-yellow-400 rounded-full opacity-80 animate-pulse"></div>
                  <div className="absolute -bottom-6 -left-6 w-6 h-6 sm:w-10 sm:h-10 bg-purple-500 rounded-full opacity-60"></div>
                  <div className="absolute top-1/2 -left-8 w-4 h-4 sm:w-6 sm:h-6 bg-blue-500 rounded-full opacity-40"></div>
                </motion.div>

                {/* Floating Info Card with Creative Shape */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="absolute -bottom-6 -right-6 sm:-bottom-8 sm:-right-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 transform rotate-2 hover:rotate-0 transition-transform duration-300"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Columbine Flower</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Premium Oil on Canvas</p>
                    </div>
                  </div>
                </motion.div>

                {/* Creative Accent Lines */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-4 left-4 w-16 h-0.5 bg-gradient-to-r from-transparent to-blue-500 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-12 h-0.5 bg-gradient-to-l from-transparent to-purple-500 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-gray-400 dark:border-gray-500 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-0.5 h-2 sm:w-1 sm:h-3 bg-gray-400 dark:bg-gray-500 rounded-full mt-2"
            ></motion.div>
          </div>
        </motion.div>
      </section>

      {/* Featured Artworks Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 text-gray-900 dark:text-white">
              Featured Artworks
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              See our handpicked selection of exceptional pieces that brings out the meaning to the word , Beauty.
            </p>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center items-center py-16 lg:py-20">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-600 dark:text-red-400">
              <p>Error loading artworks. Please try again later.</p>
            </div>
          ) : featuredArtworks.length === 0 ? (
            <div className="text-center py-10 text-gray-600 dark:text-gray-300">
              <p>No artworks found. Check back soon for our Arts collection.</p>
            </div>
          ) : (
            <FeaturedArtworks artworks={featuredArtworks} />
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12 lg:mt-16"
          >
            <Link to="/gallery">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-medium inline-flex items-center space-x-2 transition-colors duration-200"
              >
                <span>View All Artworks</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
};