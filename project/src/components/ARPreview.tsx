import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, X, Camera } from 'lucide-react';
import { Artwork } from '../context/AppContext';

export interface ARPreviewProps {
  artwork: Artwork;
  onClose: () => void;
}

export const ARPreview = ({ artwork, onClose }: ARPreviewProps) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [frameStyle, setFrameStyle] = useState<string | null>(null);
  const [usingCamera, setUsingCamera] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [roomBackground, setRoomBackground] = useState(0);

  const roomBackgrounds = [
    "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1600607687644-c7f34b5e0f01?auto=format&fit=crop&q=80"
  ];

  const frameStyles = {
    'classic-wood': {
      border: '20px solid #8B4513',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      borderRadius: '5px'
    },
    'modern-black': {
      border: '15px solid #000',
      boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
      borderRadius: '0'
    },
    'minimal-white': {
      border: '10px solid #fff',
      boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
      borderRadius: '2px'
    },
    'ornate-gold': {
      border: '25px solid #DAA520',
      boxShadow: '0 0 15px rgba(0, 0, 0, 0.4)',
      borderRadius: '8px'
    }
  };

  // Initialize camera
  useEffect(() => {
    if (usingCamera) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          setCameraError(true);
        }
      };
      
      startCamera();
      
      // Cleanup
      return () => {
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
      };
    }
  }, [usingCamera]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleRotateLeft = () => {
    setRotation(prev => prev - 5);
  };

  const handleRotateRight = () => {
    setRotation(prev => prev + 5);
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const changeRoom = () => {
    if (!usingCamera) {
      setRoomBackground((prev) => (prev + 1) % roomBackgrounds.length);
    }
  };

  const toggleCamera = async () => {
    setUsingCamera(!usingCamera);
    setCameraError(false);
  };

  // Center the artwork initially
  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setPosition({ x: width / 2 - 150, y: height / 2 - 150 });
    }
  }, []);

  return (
    <div className="relative h-full bg-gray-100 overflow-hidden" ref={containerRef}>
      {/* Background: either room image or camera feed */}
      {usingCamera ? (
        <>
          {cameraError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-white text-center p-4">
                <p className="mb-4">Camera access denied or not available.</p>
                <button 
                  onClick={() => setUsingCamera(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Use Sample Rooms Instead
                </button>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </>
      ) : (
        <img
          src={roomBackgrounds[roomBackground]}
          alt="Room"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Camera toggle button */}
      <button
        onClick={toggleCamera}
        className="absolute top-4 left-4 bg-white rounded-full shadow-lg p-2 z-10 flex items-center space-x-2"
        aria-label={usingCamera ? "Use sample rooms" : "Use camera"}
      >
        <Camera className="w-5 h-5" />
        <span className="text-sm font-medium">{usingCamera ? "Use Sample Rooms" : "Use Camera"}</span>
      </button>

      {/* Room change button - only show when not using camera */}
      {!usingCamera && (
        <button
          onClick={changeRoom}
          className="absolute top-4 left-40 bg-white rounded-full shadow-lg p-2 z-10"
          aria-label="Change room"
        >
          <span className="text-sm font-medium px-2">Change Room</span>
        </button>
      )}

      {/* Frame style selector */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-full shadow-lg p-1">
        <div className="flex space-x-2">
          <button
            onClick={() => setFrameStyle('classic-wood')}
            className={`w-10 h-10 rounded-full bg-[#8B4513] ${frameStyle === 'classic-wood' ? 'ring-2 ring-blue-500' : ''}`}
            aria-label="Classic Wood Frame"
          />
          <button
            onClick={() => setFrameStyle('modern-black')}
            className={`w-10 h-10 rounded-full bg-black ${frameStyle === 'modern-black' ? 'ring-2 ring-blue-500' : ''}`}
            aria-label="Modern Black Frame"
          />
          <button
            onClick={() => setFrameStyle('minimal-white')}
            className={`w-10 h-10 rounded-full bg-white border border-gray-200 ${frameStyle === 'minimal-white' ? 'ring-2 ring-blue-500' : ''}`}
            aria-label="Minimal White Frame"
          />
          <button
            onClick={() => setFrameStyle('ornate-gold')}
            className={`w-10 h-10 rounded-full bg-[#DAA520] ${frameStyle === 'ornate-gold' ? 'ring-2 ring-blue-500' : ''}`}
            aria-label="Ornate Gold Frame"
          />
          <button
            onClick={() => setFrameStyle(null)}
            className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ${frameStyle === null ? 'ring-2 ring-blue-500' : ''}`}
            aria-label="No Frame"
          >
            <span className="text-xs">None</span>
          </button>
        </div>
      </div>

      {/* Draggable artwork */}
      <motion.div
        drag
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        dragConstraints={containerRef}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          rotate: rotation,
          scale,
          cursor: isDragging ? 'grabbing' : 'grab',
          ...(frameStyle ? frameStyles[frameStyle as keyof typeof frameStyles] : {}),
        }}
        className="rounded-lg overflow-hidden"
      >
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-[300px] h-[300px] object-cover"
        />
      </motion.div>

      {/* Controls */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-white rounded-full shadow-lg p-2">
        <div className="flex space-x-4">
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-6 h-6" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-6 h-6" />
          </button>
          <button
            onClick={handleRotateLeft}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Rotate Left"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          <button
            onClick={handleRotateRight}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Rotate Right"
          >
            <RotateCw className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white rounded-full shadow-lg p-2 z-10"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Instructions */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white/80 rounded-lg px-4 py-2 text-black text-sm z-10 text-center">
        <p>Drag to position • Pinch or use buttons to zoom • Use frame selector to change frame</p>
      </div>
    </div>
  );
}; 