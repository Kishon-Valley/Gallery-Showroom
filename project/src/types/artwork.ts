/**
 * Artwork interface - represents an artwork in the application
 * 
 * Note on database mapping:
 * - Application code uses camelCase (e.g., imageUrl)
 * - The mapping between these formats is handled in the data access layer
 */
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
  type?: string;
  featured?: boolean;
  year?: string;
  quantity?: number;
}