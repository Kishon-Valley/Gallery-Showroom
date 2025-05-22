import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, ArrowRight, Check, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

// Import local images
import image1 from '../img/image1.jpg';
import image2 from '../img/image2.jpg';
import image3 from '../img/image3.jpg';
import image4 from '../img/image4.jpg';

// Sample artwork data (same as in Gallery.tsx)
const artworks = [
  {
    id: "1",
    title: 'Vibrant Abstraction',
    imageUrl: image1,
    artist: 'You',
    dimensions: '24" x 36"',
    medium: 'Acrylic on Canvas',
    price: 1200,
    description: 'A vibrant abstract painting with bold colors and dynamic composition.'
  },
  {
    id: "2",
    title: 'Serene Landscape',
    imageUrl: image2,
    artist: 'You',
    dimensions: '30" x 40"',
    medium: 'Oil on Canvas',
    price: 1800,
    description: 'A peaceful landscape depicting rolling hills and a calm lake at sunset.'
  },
  {
    id: "3",
    title: 'Emotional Expression',
    imageUrl: image3,
    artist: 'You',
    dimensions: '18" x 24"',
    medium: 'Mixed Media',
    price: 950,
    description: 'An expressive piece that conveys deep emotion through texture and color.'
  },
  {
    id: "4",
    title: 'Modern Composition',
    imageUrl: image4,
    artist: 'You',
    dimensions: '24" x 24"',
    medium: 'Acrylic on Canvas',
    price: 1500,
    description: 'A modern composition with geometric elements and a sophisticated color palette.'
  }
];

export const ARPreviewLanding = () => {
  const { isDarkMode } = useAppContext();
  const [activeTab, setActiveTab] = useState<'about' | 'how' | 'faq'>('about');

  return (
    <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            AR Preview Experience
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl max-w-3xl mx-auto mb-8"
          >
            See how our artwork looks in your space before you buy with our augmented reality preview.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link 
              to="/gallery" 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              Browse Gallery <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <a 
              href="#how-it-works" 
              className={`px-6 py-3 rounded-lg border transition-colors flex items-center ${
                isDarkMode 
                  ? 'border-gray-700 hover:bg-gray-800' 
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('how');
                document.getElementById('info-tabs')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              How It Works <Info className="ml-2 w-5 h-5" />
            </a>
          </motion.div>
        </div>

        {/* Featured Artwork in AR */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Artwork in AR</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {artworks.map((artwork, index) => (
              <motion.div
                key={artwork.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`rounded-lg overflow-hidden shadow-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="relative h-64">
                  <img 
                    src={artwork.imageUrl} 
                    alt={artwork.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-medium">{artwork.title}</h3>
                    <p className="text-gray-300 text-sm">{artwork.artist}</p>
                  </div>
                  <Link
                    to={`/ar-preview/${artwork.id}`}
                    className="absolute top-4 right-4 p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition-colors"
                    aria-label={`View ${artwork.title} in AR`}
                  >
                    <Video className="w-5 h-5" />
                  </Link>
                </div>
                <div className="p-4">
                  <Link
                    to={`/ar-preview/${artwork.id}`}
                    className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Try in Your Space
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Information Tabs */}
        <div id="info-tabs" className="mb-16">
          <div className="flex border-b mb-8">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'about'
                  ? isDarkMode 
                    ? 'border-b-2 border-blue-500 text-blue-400' 
                    : 'border-b-2 border-blue-600 text-blue-600'
                  : isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              About AR Preview
            </button>
            <button
              onClick={() => setActiveTab('how')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'how'
                  ? isDarkMode 
                    ? 'border-b-2 border-blue-500 text-blue-400' 
                    : 'border-b-2 border-blue-600 text-blue-600'
                  : isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'faq'
                  ? isDarkMode 
                    ? 'border-b-2 border-blue-500 text-blue-400' 
                    : 'border-b-2 border-blue-600 text-blue-600'
                  : isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              FAQ
            </button>
          </div>

          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div>
                <h3 className="text-2xl font-bold mb-4">Experience Art in Your Space</h3>
                <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Our AR Preview feature allows you to see how our artwork would look in your actual environment before making a purchase. Using your device's camera, you can place virtual artwork on your walls and see it from different angles.
                </p>
                <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  This immersive experience helps you make confident decisions about which pieces will complement your space perfectly.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Visualize artwork in your actual space</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Try different frame styles</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Adjust size and position to find the perfect fit</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span>Share screenshots with friends and family</span>
                  </li>
                </ul>
              </div>
              <div className={`rounded-lg overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-6`}>
                <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-black/20">
                  <img 
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1700&q=80" 
                    alt="AR Preview Example" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-medium mb-2">Compatible with Most Devices</h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Our AR Preview works on most modern smartphones and tablets with cameras. For the best experience, we recommend using a device with AR capabilities and ensuring you have good lighting in your space.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'how' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-bold mb-6">How to Use AR Preview</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <span className="text-blue-600 font-bold text-xl">1</span>
                  </div>
                  <h4 className="text-xl font-medium mb-3">Select an Artwork</h4>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Browse our gallery and click the AR Preview button on any artwork you'd like to visualize in your space.
                  </p>
                </div>
                
                <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <span className="text-blue-600 font-bold text-xl">2</span>
                  </div>
                  <h4 className="text-xl font-medium mb-3">Grant Camera Access</h4>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    When prompted, allow the app to access your device's camera. This is required for the AR experience to work.
                  </p>
                </div>
                
                <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <span className="text-blue-600 font-bold text-xl">3</span>
                  </div>
                  <h4 className="text-xl font-medium mb-3">Position the Artwork</h4>
                  <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Move your device to scan your space, then drag, resize, and rotate the artwork to position it perfectly on your wall.
                  </p>
                </div>
              </div>
              
              <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800/50' : 'bg-blue-50'} mb-8`}>
                <h4 className="flex items-center text-lg font-medium mb-3">
                  <Info className="w-5 h-5 mr-2 text-blue-500" />
                  Camera Permission Required
                </h4>
                <p className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  The AR Preview feature requires access to your device's camera to provide the augmented reality experience. When prompted, please allow camera access in your browser.
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  We value your privacy. Your camera feed is processed locally on your device and is not stored or transmitted to our servers.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-medium mb-4">Tips for the Best Experience</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Use in a well-lit area for better camera tracking</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Move slowly when scanning your space</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Try different frame styles to match your decor</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span>Use the zoom and rotate controls for precise placement</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-medium mb-4">Troubleshooting</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <ArrowRight className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <span>If camera access is denied, check your browser settings and try again</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <span>For poor tracking, try moving to a better lit area with more visual features</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <span>If the AR view is laggy, try closing other apps on your device</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="w-5 h-5 text-blue-500 mr-2 mt-1 flex-shrink-0" />
                      <span>You can always switch to static background mode if AR isn't working well</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'faq' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
              
              <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h4 className="text-xl font-medium mb-2">What devices support AR Preview?</h4>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Most modern smartphones and tablets with cameras support our AR Preview feature. For the best experience, we recommend using a device with AR capabilities running the latest version of iOS or Android, and using a modern browser like Chrome, Safari, or Firefox.
                </p>
              </div>
              
              <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h4 className="text-xl font-medium mb-2">Is my camera data stored or shared?</h4>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  No. Your camera feed is processed locally on your device and is not stored or transmitted to our servers. We take your privacy seriously and only use the camera feed to provide the AR experience.
                </p>
              </div>
              
              <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h4 className="text-xl font-medium mb-2">Why do I need to grant camera permissions?</h4>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Camera access is required to provide the augmented reality experience. The camera feed allows the app to understand your environment and place the virtual artwork in your real space. Without camera access, you can still use the static background mode.
                </p>
              </div>
              
              <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h4 className="text-xl font-medium mb-2">How accurate is the size representation?</h4>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  The AR Preview provides a good approximation of how the artwork will look in your space. However, due to variations in device cameras and environmental factors, there might be slight differences in scale. The dimensions listed with each artwork provide the exact measurements.
                </p>
              </div>
              
              <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h4 className="text-xl font-medium mb-2">Can I save or share my AR Preview?</h4>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Currently, you can take a screenshot of your AR Preview to save or share it. We're working on adding built-in sharing functionality in a future update.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Call to Action */}
        <div className={`rounded-lg p-8 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
          <h2 className="text-2xl font-bold mb-4">Ready to Try AR Preview?</h2>
          <p className={`max-w-2xl mx-auto mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Experience our artwork in your space with our innovative AR Preview feature. Browse our gallery and look for the AR icon to get started.
          </p>
          <Link 
            to="/gallery" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}; 