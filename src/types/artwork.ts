export interface Artwork {
  id: string;
  title: string;
  image_url: string; // Changed from imageUrl to image_url to match database schema
  price: number;
  artist: string;
  description: string;
  dimensions?: string;
  medium?: string;
  type?: string;
  featured?: boolean;
  year?: string;
  quantity?: number;
  imageUrl?: string; // For compatibility with old code
}