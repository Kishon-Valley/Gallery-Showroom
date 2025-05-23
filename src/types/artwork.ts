export interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  artist: string;
  description: string;
  dimensions?: string;
  medium?: string;
  type?: string; // Changed from category to type to match database schema
  featured?: boolean;
  year?: string;
  quantity?: number;
}