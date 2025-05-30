import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Artwork } from '../../types/artwork';

interface Category {
  id: string;
  name: string;
  description?: string;
}

const ArtworkManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      // Explicitly specify the columns we want to select using their database names
      const { data, error } = await supabase
        .from('artworks')
        .select(`
          id, 
          title, 
          artist, 
          description, 
          price, 
          medium, 
          dimensions, 
          year, 
          featured, 
          quantity, 
          category, 
          type, 
          created_at, 
          imageUrl
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure data is an array before mapping
      const artworkData = Array.isArray(data) ? data : [];
      
      // Map database columns (snake_case) to TypeScript properties (camelCase)
      const mappedData = artworkData.map(item => {
        // Create artwork object with required fields
        const artwork: Partial<Artwork> = {
          id: item.id,
          title: item.title,
          artist: item.artist,
          description: item.description,
          price: item.price,
          // Handle the image URL field - use default if not available
          imageUrl: item.imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'
        };
        
        // Add optional fields if they exist in the database record
        if (item.medium !== undefined) artwork.medium = item.medium;
        if (item.dimensions !== undefined) artwork.dimensions = item.dimensions;
        if (item.year !== undefined) artwork.year = item.year;
        if (item.featured !== undefined) artwork.featured = item.featured;
        if (item.quantity !== undefined) artwork.quantity = item.quantity;
        if (item.category !== undefined) artwork.category = item.category;
        if (item.type !== undefined) artwork.type = item.type;
        
        return artwork as Artwork;
      });
      
      setArtworks(mappedData);
    } catch (error: any) {
      console.error('Error fetching artworks:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedArtwork(null);
    setIsFormOpen(true);
  };

  const handleEdit = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this artwork?')) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('artworks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setArtworks(artworks.filter(artwork => artwork.id !== id));
    } catch (error: any) {
      console.error('Error deleting artwork:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedArtwork(null);
  };

  const handleFormSubmit = async (artwork: Artwork) => {
    try {
      setLoading(true);
      console.log('Submitting artwork:', artwork);
      
      // Create a sanitized version of the artwork data that matches the database schema
      const sanitizedArtwork = {
        title: artwork.title,
        artist: artwork.artist,
        description: artwork.description,
        price: artwork.price,
        imageUrl: artwork.imageUrl, 
        medium: artwork.medium,
        dimensions: artwork.dimensions,
        year: artwork.year,
        featured: artwork.featured,
        quantity: artwork.quantity,
        category: artwork.category
      };
      
      console.log('Artwork featured status:', artwork.featured);
      console.log('Sanitized artwork data:', sanitizedArtwork);
      
      if (selectedArtwork) {
        // Update existing artwork
        console.log('Updating artwork with ID:', selectedArtwork.id);
        const { error } = await supabase
          .from('artworks')
          .update(sanitizedArtwork)
          .eq('id', selectedArtwork.id);
          
        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }
        
        setArtworks(artworks.map(a => 
          a.id === selectedArtwork.id ? { ...a, ...artwork } : a
        ));
      } else {
        // Create new artwork
        console.log('Creating new artwork');
        const { data, error } = await supabase
          .from('artworks')
          .insert([sanitizedArtwork])
          .select();
          
        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          const newArtwork: Artwork = {
            id: data[0].id,
            title: data[0].title,
            artist: data[0].artist,
            description: data[0].description,
            price: data[0].price,
            imageUrl: data[0].imageUrl, 
            medium: data[0].medium,
            dimensions: data[0].dimensions,
            year: data[0].year,
            featured: data[0].featured,
            quantity: data[0].quantity,
            category: data[0].category
          };
          setArtworks([...artworks, newArtwork]);
        }
      }
      
      setIsFormOpen(false);
      setSelectedArtwork(null);
      setError(null);
    } catch (error: any) {
      console.error('Error saving artwork:', error);
      setError(error.message || 'Failed to save artwork');
      alert('Error saving artwork: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  if (loading && artworks.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Artworks</h2>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add New Artwork
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Artist
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {artworks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No artworks found. Add some!
                </td>
              </tr>
            ) : (
              artworks.map(artwork => (
                <tr key={artwork.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img 
                      src={artwork.imageUrl} 
                      alt={artwork.title} 
                      className="h-16 w-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{artwork.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{artwork.artist}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">${artwork.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{artwork.category || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(artwork)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(artwork.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <ArtworkForm
          artwork={selectedArtwork}
          onSubmit={handleFormSubmit}
          onCancel={handleFormClose}
        />
      )}
    </div>
  );
};

interface ArtworkFormProps {
  artwork: Artwork | null;
  onSubmit: (artwork: Artwork) => void;
  onCancel: () => void;
}

const ArtworkForm: React.FC<ArtworkFormProps> = ({ artwork, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Artwork>>(
    artwork || {
      title: '',
      artist: '',
      description: '',
      price: 0,
      imageUrl: '',
      medium: '',
      dimensions: '',
      category: '',
      year: '',
      featured: false,
      quantity: 1
    }
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      
      // First check if the categories table exists
      const { error: tableError } = await supabase
        .from('categories')
        .select('id')
        .limit(1);
      
      // If categories table exists and no error
      if (!tableError) {
        // Fetch all categories
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('name', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          // Fallback to default categories if table exists but is empty
          setCategories([
            { id: 'painting', name: 'Painting' },
            { id: 'sculpture', name: 'Sculpture' },
            { id: 'photography', name: 'Photography' },
            { id: 'digital', name: 'Digital' },
            { id: 'mixed-media', name: 'Mixed Media' },
            { id: 'other', name: 'Other' }
          ]);
        }
      } else {
        // Fallback to default categories if table doesn't exist
        setCategories([
          { id: 'painting', name: 'Painting' },
          { id: 'sculpture', name: 'Sculpture' },
          { id: 'photography', name: 'Photography' },
          { id: 'digital', name: 'Digital' },
          { id: 'mixed-media', name: 'Mixed Media' },
          { id: 'other', name: 'Other' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories on error
      setCategories([
        { id: 'painting', name: 'Painting' },
        { id: 'sculpture', name: 'Sculpture' },
        { id: 'photography', name: 'Photography' },
        { id: 'digital', name: 'Digital' },
        { id: 'mixed-media', name: 'Mixed Media' },
        { id: 'other', name: 'Other' }
      ]);
    } finally {
      setLoadingCategories(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (imageFile: File): Promise<string> => {
    try {
      setUploading(true);
      console.log('Starting upload process with file:', imageFile.name, 'Size:', imageFile.size, 'Type:', imageFile.type);
      
      if (!imageFile) {
        throw new Error('No image file selected');
      }

      // Validate file size (10MB limit)
      if (imageFile.size > 10 * 1024 * 1024) {
        throw new Error('File size exceeds 10MB limit');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(imageFile.type)) {
        throw new Error('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
      }
      
      // Create a unique file name with timestamp
      const fileExt = imageFile.name.split('.').pop()?.toLowerCase();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `artworks/${fileName}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
      
      if (!uploadData) {
        throw new Error('Upload completed but no data returned');
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('artworks')
        .getPublicUrl(filePath);
      
      if (!urlData?.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw new Error(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    console.log('Form data featured status:', formData.featured);
    
    try {
      // Validate required fields
      if (!formData.title || !formData.artist || !formData.price) {
        alert('Please fill in all required fields (Title, Artist, Price)');
        return;
      }
      
      // Handle image upload
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        console.log('Uploading image file...');
        try {
          setUploading(true);
          imageUrl = await uploadImage(imageFile);
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          alert('Failed to upload image. Please try again or continue without an image.');
          // Ask if they want to continue without an image
          if (!confirm('Do you want to continue saving the artwork without an image?')) {
            setUploading(false);
            return; // Stop the submission
          }
          // If they choose to continue, use a placeholder
          imageUrl = 'https://via.placeholder.com/300x300?text=No+Image';
        } finally {
          setUploading(false);
        }
      }
      
      // If we don't have an image URL and we're adding a new artwork, use a placeholder
      if (!imageUrl && !artwork) {
        console.log('No image provided, using placeholder');
        imageUrl = 'https://via.placeholder.com/300x300?text=No+Image';
      }
      
      // Prepare artwork data with image URL
      const artworkData = {
        ...formData,
        imageUrl: imageUrl, // Keep using camelCase in the application code
        price: typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price || 0,
        quantity: typeof formData.quantity === 'string' ? parseInt(formData.quantity as string) : formData.quantity || 1,
      } as Artwork;
      
      console.log('Submitting artwork data:', artworkData);
      onSubmit(artworkData);
    } catch (error) {
      console.error('Error in form submission:', error);
      alert('Failed to save artwork. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          {artwork ? 'Edit Artwork' : 'Add New Artwork'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Artist
              </label>
              <input
                type="text"
                name="artist"
                value={formData.artist || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price || ''}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                disabled={loadingCategories}
              >
                <option value="">Select Category</option>
                {loadingCategories ? (
                  <option value="" disabled>Loading categories...</option>
                ) : (
                  categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medium
              </label>
              <input
                type="text"
                name="medium"
                value={formData.medium || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dimensions
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions || ''}
                onChange={handleChange}
                placeholder="e.g., 24 x 36 inches"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="text"
                name="year"
                value={formData.year || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity Available
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity || ''}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              {formData.imageUrl && (
                <div className="mb-2">
                  <img 
                    src={formData.imageUrl} 
                    alt="Artwork preview" 
                    className="h-40 object-contain"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured || false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Featured Artwork</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : artwork ? 'Update Artwork' : 'Add Artwork'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArtworkManager;
