import { Artwork } from '../types/artwork';

export const featuredArtworks: Artwork[] = [
  {
    id: '1',
    title: 'Ethereal Dreams',
    artist: 'Isabella Martinez',
    price: 12500,
    dimensions: '48 x 36 inches',
    medium: 'Oil on Canvas',
    description: 'A mesmerizing exploration of consciousness through vibrant colors and fluid forms.',
    imageUrl: 'https://images.unsplash.com/photo-1549887534-1541e9326642?auto=format&fit=crop&q=80',
    category: 'painting',
    featured: true
  },
  {
    id: '2',
    title: 'Urban Symphony',
    artist: 'Marcus Chen',
    price: 8900,
    dimensions: '40 x 30 inches',
    medium: 'Acrylic on Canvas',
    description: 'A dynamic interpretation of city life through abstract geometric patterns.',
    imageUrl: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80',
    category: 'painting',
    featured: true
  },
  {
    id: '3',
    title: 'Whispers of Nature',
    artist: 'Sofia Patel',
    price: 5600,
    dimensions: '24 x 36 inches',
    medium: 'Charcoal on Paper',
    description: 'A delicate exploration of natural forms through masterful charcoal technique.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80',
    category: 'drawing',
    featured: true
  }
];