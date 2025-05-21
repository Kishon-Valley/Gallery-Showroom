import { useState, useEffect } from 'react';
import { Facebook, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled to the bottom
      const scrolledToBottom = 
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      
      setIsVisible(scrolledToBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.footer
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="bg-white border-t border-gray-200 py-8 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
              {/* Social Links */}
              <div className="flex space-x-6">
                <a
                  href="#facebook"  // Will update later
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors transform hover:scale-110"
                >
                  <Facebook className="w-6 h-6" />
                  <span className="sr-only">Facebook</span>
                </a>
                <a
                  href="#instagram"  // Will update later
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-pink-600 transition-colors transform hover:scale-110"
                >
                  <Instagram className="w-6 h-6" />
                  <span className="sr-only">Instagram</span>
                </a>
              </div>

              {/* Copyright */}
              <div className="text-center md:text-right">
                <p className="text-gray-600">
                  © 2025 AJ Borges. All rights reserved.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Bringing Brazilian artistry to the world
                </p>
              </div>
            </div>
          </div>
        </motion.footer>
      )}
    </AnimatePresence>
  );
}; 