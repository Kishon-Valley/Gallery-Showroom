import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FeaturedArtworks } from '../components/FeaturedArtworks';
import { supabase } from '../lib/supabase';
import { Artwork } from '../types/artwork';

export const Home = () => {
  const [featuredArtworks, setFeaturedArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check database schema first
    const checkDatabaseSchema = async () => {
      try {
        console.log('Checking database schema...');
        const { data, error } = await supabase
          .from('artworks')
          .select('id, featured')
          .limit(1);
          
        console.log('Schema check result:', data);
        console.log('Schema check error:', error);
      } catch (error) {
        console.error('Error checking schema:', error);
      }
    };
    
    checkDatabaseSchema();
    
    const fetchFeaturedArtworks = async () => {
      try {
        setLoading(true);
        console.log('Fetching featured artworks...');
        const { data, error } = await supabase
          .from('artworks')
          .select('*')
          .eq('featured', true)
          .limit(3);
        
        console.log('Featured artworks data:', data);
        console.log('Featured artworks error:', error);

        if (error) {
          throw error;
        }

        if (data) {
          // Map the database fields to the Artwork interface
          const artworks: Artwork[] = data.map(item => ({
            id: item.id,
            title: item.title,
            artist: item.artist,
            description: item.description,
            price: item.price,
            imageUrl: item.imageUrl,
            dimensions: item.dimensions,
            medium: item.medium,
            year: item.year,
            featured: item.featured,
            category: item.category,
            quantity: item.quantity
          }));
          setFeaturedArtworks(artworks);
        }
      } catch (error) {
        console.error('Error fetching featured artworks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArtworks();
  }, []);

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
          {/* Mobile-only overlay headline inside hero image */}
          <div className="lg:hidden mb-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-extrabold leading-tight drop-shadow-md"
            >
              Home,
              <br />
              <span>To Exceptional Arts</span>
            </motion.h1>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block text-5xl md:text-7xl font-bold mb-6"
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
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : featuredArtworks.length > 0 ? (
            <FeaturedArtworks artworks={featuredArtworks} />
          ) : (
            <p className="text-center text-gray-500">No featured artworks available. Add some in the admin panel!</p>
          )}
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