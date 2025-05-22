import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Artwork } from '../types/artwork';

interface FeaturedArtworkProps {
  artwork: Artwork;
  index: number;
}

export const FeaturedArtwork: React.FC<FeaturedArtworkProps> = ({ artwork, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="group relative overflow-hidden rounded-lg"
    >
      <div className="aspect-w-3 aspect-h-4 w-full overflow-hidden">
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-xl font-semibold">{artwork.title}</h3>
          <p className="mt-1">{artwork.artist}</p>
          <p className="mt-2 font-light">${artwork.price.toLocaleString()}</p>
        </div>
      </div>
    </motion.div>
  );
};