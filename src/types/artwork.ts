export interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  artist: string;
  description: string;
  dimensions?: string;
  medium?: string;
  category?: string;
  featured?: boolean;
  year?: string;
  quantity?: number;
}