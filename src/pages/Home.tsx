import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FeaturedArtworks } from '../components/FeaturedArtworks';
import { supabase } from '../lib/supabase';
import { Artwork as DbArtwork } from '../types/artwork';
import { Artwork as FrontendArtwork } from '../context/AppContext';

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
        imageUrl: artwork.imageUrl, // Map imageUrl to imageUrl for the component
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
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Featured Artworks</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our handpicked selection of exceptional pieces that represent
              the pinnacle of contemporary artistic expression.
            </p>
          </motion.div>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
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
          <div className="text-center mt-12">
            <Link to="/gallery">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-medium inline-flex items-center space-x-2 hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
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