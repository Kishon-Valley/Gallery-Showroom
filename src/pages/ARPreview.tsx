import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw, RotateCw, X, Camera, Image } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';

// Import local images and artwork data from Gallery
import image1 from '../img/image1.jpg';
import image2 from '../img/image2.jpg';
import image3 from '../img/image3.jpg';
import image4 from '../img/image4.jpg';

// Define a unified artwork type
interface ArtworkBase {
  id: string;
  title: string;
  imageUrl: string;
  artist: string;
  price: number;
  description?: string;
  dimensions?: string;
  medium?: string;
  year?: string;
}

// Local artwork data (same as in Gallery.tsx)
const localArtworks: ArtworkBase[] = [
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

export const ARPreview = () => {
  const { artworks, isDarkMode } = useAppContext();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [artwork, setArtwork] = useState<ArtworkBase | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [frameStyle, setFrameStyle] = useState('modern');
  const [useLiveCamera, setUseLiveCamera] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Find the artwork based on the ID from the URL
  useEffect(() => {
    if (id) {
      // First check local artworks
      let foundArtwork = localArtworks.find(a => a.id === id);
      
      // If not found in local artworks, check context artworks
      if (!foundArtwork) {
        const contextArtwork = artworks.find(a => a.id === id);
        if (contextArtwork) {
          foundArtwork = {
            ...contextArtwork,
            description: contextArtwork.description || ''
          };
        }
      }
      
      if (foundArtwork) {
        setArtwork(foundArtwork);
      } else {
        // Redirect if artwork not found
        navigate('/gallery');
      }
    }
  }, [id, artworks, navigate]);
  
  // Handle camera access
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const setupCamera = async () => {
      try {
        if (useLiveCamera) {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraPermission(true);
            setCameraError(null);
          }
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setCameraPermission(false);
        setCameraError('Unable to access camera. Please check permissions and try again.');
      }
    };
    
    if (useLiveCamera) {
      setupCamera();
    }
    
    // Cleanup function to stop camera when component unmounts or mode changes
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [useLiveCamera]);
  
  const toggleCameraMode = () => {
    setUseLiveCamera(prev => !prev);
    // Reset position when switching modes
    setPosition({ x: 0, y: 0 });
  };
  
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };
  
  const handleRotateLeft = () => {
    setRotation(prev => prev - 15);
  };
  
  const handleRotateRight = () => {
    setRotation(prev => prev + 15);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  const getFrameStyle = () => {
    switch (frameStyle) {
      case 'classic':
        return 'border-8 border-amber-800 shadow-lg';
      case 'modern':
        return 'border-4 border-gray-800 shadow-md';
      case 'minimal':
        return 'border-[1px] border-gray-300 shadow-sm';
      case 'none':
        return '';
      default:
        return 'border-4 border-gray-800 shadow-md';
    }
  };
  
  if (!artwork) {
    return (
      <div className={`min-h-screen pt-20 flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div 
      className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} mr-4`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">AR Preview: {artwork.title}</h1>
          
          <div className="ml-auto">
            <button
              onClick={toggleCameraMode}
              className={`flex items-center px-4 py-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-200 hover:bg-gray-300'
              } transition-colors`}
            >
              {useLiveCamera ? (
                <>
                  <Image className="w-5 h-5 mr-2" />
                  <span>Use Static Background</span>
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5 mr-2" />
                  <span>Use Live Camera</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div 
              className={`relative w-full h-[60vh] overflow-hidden rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
              style={!useLiveCamera ? {
                backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1700&q=80')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              } : undefined}
            >
              {useLiveCamera && (
                <>
                  {cameraPermission === false ? (
                    <div className="absolute inset-0 flex items-center justify-center flex-col p-6 text-center">
                      <Camera className="w-12 h-12 mb-4 text-red-500" />
                      <h3 className="text-xl font-bold mb-2">Camera Access Required</h3>
                      <p className="mb-4">{cameraError || 'Please allow camera access to use AR preview.'}</p>
                      <button
                        onClick={toggleCameraMode}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Switch to Static Mode
                      </button>
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </>
              )}
              
              <motion.div
                className={`absolute cursor-move ${getFrameStyle()} bg-white rounded-sm overflow-hidden`}
                style={{
                  width: '300px',
                  height: '400px',
                  x: position.x,
                  y: position.y,
                  rotate: rotation,
                  scale: scale,
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                whileTap={{ cursor: 'grabbing' }}
              >
                <img 
                  src={artwork.imageUrl} 
                  alt={artwork.title} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/50 rounded-full p-2">
                <button
                  onClick={handleZoomIn}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button
                  onClick={handleRotateLeft}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={handleRotateRight}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/40 text-white"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {useLiveCamera && (
              <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                <p className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                  </svg>
                  For best results, hold your device steady and move around to find the perfect spot for your artwork.
                </p>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <div className={`rounded-lg shadow-sm p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className="text-xl font-semibold mb-4">Artwork Details</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Title</p>
                  <p className="font-medium">{artwork.title}</p>
                </div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Artist</p>
                  <p className="font-medium">{artwork.artist}</p>
                </div>
                {artwork.dimensions && (
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Dimensions</p>
                    <p className="font-medium">{artwork.dimensions}</p>
                  </div>
                )}
                {artwork.medium && (
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Medium</p>
                    <p className="font-medium">{artwork.medium}</p>
                  </div>
                )}
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Price</p>
                  <p className="font-medium">${artwork.price.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Frame Style</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFrameStyle('classic')}
                    className={`p-3 rounded-lg border ${
                      frameStyle === 'classic' 
                        ? 'border-blue-500 ring-2 ring-blue-500' 
                        : isDarkMode ? 'border-gray-700' : 'border-gray-300'
                    }`}
                  >
                    <div className="w-full h-12 border-8 border-amber-800"></div>
                    <p className="mt-2 text-sm text-center">Classic</p>
                  </button>
                  <button
                    onClick={() => setFrameStyle('modern')}
                    className={`p-3 rounded-lg border ${
                      frameStyle === 'modern' 
                        ? 'border-blue-500 ring-2 ring-blue-500' 
                        : isDarkMode ? 'border-gray-700' : 'border-gray-300'
                    }`}
                  >
                    <div className="w-full h-12 border-4 border-gray-800"></div>
                    <p className="mt-2 text-sm text-center">Modern</p>
                  </button>
                  <button
                    onClick={() => setFrameStyle('minimal')}
                    className={`p-3 rounded-lg border ${
                      frameStyle === 'minimal' 
                        ? 'border-blue-500 ring-2 ring-blue-500' 
                        : isDarkMode ? 'border-gray-700' : 'border-gray-300'
                    }`}
                  >
                    <div className="w-full h-12 border-[1px] border-gray-300"></div>
                    <p className="mt-2 text-sm text-center">Minimal</p>
                  </button>
                  <button
                    onClick={() => setFrameStyle('none')}
                    className={`p-3 rounded-lg border ${
                      frameStyle === 'none' 
                        ? 'border-blue-500 ring-2 ring-blue-500' 
                        : isDarkMode ? 'border-gray-700' : 'border-gray-300'
                    }`}
                  >
                    <div className="w-full h-12 border-dashed border-2 border-gray-400 flex items-center justify-center">
                      <X className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="mt-2 text-sm text-center">No Frame</p>
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  • Drag the artwork to position it on the wall
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  • Use the zoom controls to resize
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  • Rotate to find the perfect angle
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  • Try different frames to match your decor
                </p>
                {useLiveCamera && (
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    • Move around to see the artwork in different locations
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};