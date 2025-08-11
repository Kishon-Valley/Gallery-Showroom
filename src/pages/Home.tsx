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
    <main className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Hero Section - Mobile First Design */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjOUM5MkFDIiBmaWxsLW9wYWNpdHk9IjAuMDMiPjxwYXRoIGQ9Ik0wIDQwTDQwIDBIMjBMMCAyME00MCA0MFYyMEwyMCA0MCIvPjwvZz48L3N2Zz4=')] dark:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSIjZmZmZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDMiPjxwYXRoIGQ9Ik0wIDQwTDQwIDBIMjBMMCAyME00MCA0MFYyMEwyMCA0MCIvPjwvZz48L3N2Zz4=')]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col items-center text-center">
            {/* Main Content - Mobile Optimized */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-2xl"
            >
              {/* Hero Image - Mobile First */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative mb-8 lg:mb-12"
              >
                <div className="relative mx-auto w-full max-w-xs sm:max-w-sm">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={columbineImage}
                      alt="Columbine Flower - Premium Artwork"
                      className="w-full h-64 sm:h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  
                  {/* Floating Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full px-4 py-2 shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">Columbine Flower</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Headline - Mobile Optimized Typography */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white leading-tight"
              >
                Art That
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                  Speaks to You
                </span>
              </motion.h1>

              {/* Subtitle - Mobile Optimized */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-md mx-auto"
              >
                Discover extraordinary artworks that capture life's beauty and emotion. 
                Each piece tells a unique story.
              </motion.p>

              {/* CTA Buttons - Mobile Stacked */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link to="/gallery" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <span>Explore Gallery</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                
                <Link to="/ar-preview" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Try AR Preview</span>
                  </motion.button>
                </Link>
              </motion.div>

              {/* Feature Pills - Mobile Friendly */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-wrap justify-center gap-3 mt-8"
              >
                {[
                  { icon: Palette, text: 'Original Art' },
                  { icon: Heart, text: 'Curated Collection' },
                  { icon: ShoppingCart, text: 'Secure Checkout' }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <feature.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Modern Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center"
          >
            <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-3 bg-gray-400 dark:bg-gray-500 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Artworks Section - Mobile Optimized */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
            >
              Featured Artworks
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              Handpicked masterpieces that showcase exceptional talent and emotional depth. 
              Each artwork is carefully selected for its unique story and visual impact.
            </motion.p>
          </motion.div>
          
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center py-20"
            >
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gradient-to-r from-blue-600 to-purple-600"></div>
                <div className="absolute inset-0 animate-ping rounded-full border border-blue-600 opacity-20"></div>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">We couldn't load the artworks. Please try refreshing the page.</p>
                <button
                  onClick={fetchFeaturedArtworks}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          ) : featuredArtworks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Coming Soon</h3>
                <p className="text-gray-600 dark:text-gray-300">Our curated collection is being prepared. Check back soon for our latest artworks.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <FeaturedArtworks artworks={featuredArtworks} />
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12 lg:mt-16"
          >
            <Link to="/gallery">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold inline-flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span>View All Artworks</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* Mobile App Banner */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="py-16 lg:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
            >
              Experience Art Like Never Before
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto opacity-90"
            >
              Download our mobile app for the best experience. Get exclusive previews, 
              save your favorites, and purchase securely with Apple Pay & Google Pay.
            </motion.p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 shadow-lg"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17.48 2 13.85 2 10.37c0-3.87 2.44-5.93 4.83-5.93 1.27 0 2.48.67 3.12.67.65 0 1.63-.67 2.85-.67 2.44 0 4.83 2.2 4.83 5.93 0 3.48-2.25 7.1-4.39 9.13zM12 4.45c.73-1 1.5-1.89 2.76-1.89 1.26 0 2.1.89 2.38 1.89-.48 1-1.5 1.89-2.76 1.89-1.26 0-2.1-.89-2.38-1.89z"/>
                </svg>
                <span>Download for iOS</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.6 7.8c-.2-.5-.5-1-.9-1.4L16 2.3c-.4-.4-.9-.7-1.4-.9-.5-.2-1-.3-1.5-.3H8c-.5 0-1 .1-1.5.3-.5.2-1 .5-1.4.9L2.4 6.4c-.4.4-.7.9-.9 1.4-.2.5-.3 1-.3 1.5v8c0 .5.1 1 .3 1.5.2.5.5 1 .9 1.4l4.7 4.7c.4.4.9.7 1.4.9.5.2 1 .3 1.5.3h8c.5 0 1-.1 1.5-.3.5-.2 1-.5 1.4-.9l4.7-4.7c.4-.4.7-.9.9-1.4.2-.5.3-1 .3-1.5v-8c0-.5-.1-1-.3-1.5zM12 20c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z"/>
                </svg>
                <span>Download for Android</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Mobile Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed bottom-4 left-4 right-4 sm:hidden z-50"
      >
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="flex justify-around items-center">
            <Link to="/gallery" className="flex flex-col items-center space-y-1 text-blue-600 dark:text-blue-400">
              <Palette className="w-6 h-6" />
              <span className="text-xs font-medium">Gallery</span>
            </Link>
            
            <Link to="/ar-preview" className="flex flex-col items-center space-y-1 text-gray-700 dark:text-gray-300">
              <Camera className="w-6 h-6" />
              <span className="text-xs font-medium">AR Preview</span>
            </Link>
            
            <Link to="/cart" className="flex flex-col items-center space-y-1 text-gray-700 dark:text-gray-300">
              <ShoppingCart className="w-6 h-6" />
              <span className="text-xs font-medium">Cart</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
};