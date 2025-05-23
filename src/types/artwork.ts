export interface Artwork {
  id: string;
  title: string;
  image_url: string; // This matches the actual column name in the database
  price: number;
  artist: string;
  description: string;
  dimensions?: string;
  medium?: string;
  type?: string;
  featured?: boolean;
  year?: string;
  quantity?: number;
}