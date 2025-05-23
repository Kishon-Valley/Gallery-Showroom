import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Artwork } from '../../types/artwork';

const ArtworkManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchArtworks();
    // Inspect the database schema to see what columns are available
    inspectDatabaseSchema();
  }, []);
  
  // Function to inspect the database schema
  const inspectDatabaseSchema = async () => {
    try {
      console.log('Inspecting database schema...');
      // Get a sample artwork to see the actual field names
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .limit(1);
        
      if (error) {
        console.error('Error fetching sample artwork:', error);
        return;
      }
      
      if (data && data.length > 0) {
        console.log('Sample artwork from database:', data[0]);
        console.log('Available fields:', Object.keys(data[0]));
      } else {
        console.log('No artworks found in the database');
      }
    } catch (err) {
      console.error('Error inspecting schema:', err);
    }
  };

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artworks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArtworks(data || []);
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
      console.log('Saving artwork to database:', artwork);
      
      // Create a sanitized version of the artwork data that only includes fields we know exist in the database
      // Based on the database schema, the field is actually called 'imageUrl' not 'image_url'
      const sanitizeData = (data: any) => {
        // Map our form fields to the actual database column names
        const fieldMappings: Record<string, string> = {
          'title': 'title',
          'artist': 'artist',
          'description': 'description',
          'price': 'price',
          'image_url': 'imageUrl', // Database uses camelCase 'imageUrl' not snake_case 'image_url'
          'medium': 'medium',
          'dimensions': 'dimensions',
          'year': 'year',
          'featured': 'featured',
          'quantity': 'quantity',
          'type': 'type'
        };
        
        const sanitized: any = {};
        
        // Add mapped fields to the sanitized object
        Object.entries(data).forEach(([key, value]) => {
          // If the key is image_url, map it to imageUrl for the database
          if (key === 'image_url') {
            sanitized['imageUrl'] = value;
          } else if (fieldMappings[key]) {
            sanitized[fieldMappings[key]] = value;
          } else if (value !== undefined) {
            sanitized[key] = value;
          }
        });
        
        // Log the sanitized data for debugging
        console.log('Original data:', data);
        console.log('Sanitized data for database:', sanitized);
        
        return sanitized;
      };
      
      if (selectedArtwork) {
        // Update existing artwork
        console.log('Updating existing artwork with ID:', selectedArtwork.id);
        
        // Remove id from the update payload and sanitize data
        const { id, ...rawUpdateData } = artwork;
        const updateData = sanitizeData(rawUpdateData);
        
        console.log('Sanitized update data:', updateData);
        
        const { error } = await supabase
          .from('artworks')
          .update(updateData)
          .eq('id', selectedArtwork.id);
          
        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }
        
        console.log('Artwork updated successfully');
        setArtworks(artworks.map(a => 
          a.id === selectedArtwork.id ? { ...a, ...artwork } : a
        ));
      } else {
        // Create new artwork
        console.log('Creating new artwork');
        
        // Remove any id field if it exists and sanitize data
        const { id, ...rawArtworkData } = artwork;
        const newArtworkData = sanitizeData(rawArtworkData);
        
        console.log('Sanitized insert data:', newArtworkData);
        
        const { data, error } = await supabase
          .from('artworks')
          .insert([newArtworkData])
          .select();
          
        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }
        
        console.log('New artwork created:', data);
        if (data && data.length > 0) {
          setArtworks([...artworks, data[0]]);
        }
      }
      
      setIsFormOpen(false);
      setSelectedArtwork(null);
      setError(null); // Clear any previous errors
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
                Type
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
                    <div className="text-sm text-gray-500">{artwork.type || 'N/A'}</div>
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
      type: '',
      year: '',
      featured: false,
      quantity: 1
    }
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return formData.imageUrl || '';
    
    try {
      setUploading(true);
      console.log('Starting image upload process...');
      
      // Create a unique file name
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `artwork-images/${fileName}`;
      
      console.log('Uploading to path:', filePath);
      
      // Check if the storage bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      console.log('Available buckets:', buckets);
      
      // Create the bucket if it doesn't exist
      if (!buckets?.some(bucket => bucket.name === 'artworks')) {
        console.log('Creating artworks bucket...');
        const { error: createBucketError } = await supabase.storage.createBucket('artworks', {
          public: true
        });
        
        if (createBucketError) {
          console.error('Error creating bucket:', createBucketError);
          // Continue anyway, as the bucket might exist but not be visible to this user
        }
      }
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('artworks')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      
      console.log('Upload successful:', uploadData);
      
      // Get public URL
      const { data } = supabase.storage
        .from('artworks')
        .getPublicUrl(filePath);
      
      console.log('Public URL:', data.publicUrl);
      
      // Update the imageUrl field in the form data (this matches the database column name)
      setFormData(prev => ({
        ...prev,
        imageUrl: data.publicUrl
      }));
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      return formData.imageUrl || '';
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    
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
        setUploading(true);
        imageUrl = await uploadImage();
        setUploading(false);
      }
      
      // If we don't have an image URL and we're adding a new artwork, use a placeholder
      if (!imageUrl && !artwork) {
        console.log('No image provided, using placeholder');
        imageUrl = 'https://via.placeholder.com/300x300?text=No+Image';
      }
      
      // Prepare artwork data with image URL
      const artworkData = {
        ...formData,
        // Use imageUrl to match the database column name
        imageUrl: imageUrl,
        // Ensure price is a number
        price: typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price || 0,
        // Ensure quantity is a number
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
                Type
              </label>
              <select
                name="type"
                value={formData.type || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Type</option>
                <option value="Painting">Painting</option>
                <option value="Sculpture">Sculpture</option>
                <option value="Photography">Photography</option>
                <option value="Digital">Digital</option>
                <option value="Mixed Media">Mixed Media</option>
                <option value="Other">Other</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">This will be stored as the artwork type</p>
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
