import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  featuredArtworksCount: number;
  enableSales: boolean;
  enableUserRegistration: boolean;
  maintenanceMode: boolean;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

export const Settings: React.FC = () => {
  // Tab state for settings sections
  const [activeTab, setActiveTab] = useState<'general' | 'categories'>('general');
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Art Gallery',
    siteDescription: 'Online art gallery and marketplace',
    contactEmail: 'contact@example.com',
    featuredArtworksCount: 6,
    enableSales: true,
    enableUserRegistration: true,
    maintenanceMode: false
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      // Fetch settings from Supabase
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" error, which is fine for initial setup
        throw error;
      }
      
      if (data) {
        setSettings(data);
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setSettings({ ...settings, [name]: checked });
    } else if (type === 'number') {
      setSettings({ ...settings, [name]: parseInt(value) });
    } else {
      setSettings({ ...settings, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Check if settings record exists
      const { count, error: countError } = await supabase
        .from('site_settings')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;
      
      let result;
      
      if (count && count > 0) {
        // Update existing settings
        result = await supabase
          .from('site_settings')
          .update(settings)
          .eq('id', 1);  // Assuming there's only one settings record with id=1
      } else {
        // Insert new settings
        result = await supabase
          .from('site_settings')
          .insert([{ ...settings, id: 1 }]);
      }
      
      if (result.error) throw result.error;
      
      setSuccess('Settings saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setError(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'general'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            General Settings
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-4 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'categories'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manage Categories
          </button>
        </nav>
      </div>
      
      {activeTab === 'general' && (
        <>
          <h2 className="text-xl font-semibold mb-6">Site Settings</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site Name
            </label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              value={settings.contactEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Site Description
            </label>
            <textarea
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Featured Artworks Count
            </label>
            <input
              type="number"
              name="featuredArtworksCount"
              value={settings.featuredArtworksCount}
              onChange={handleChange}
              min="1"
              max="12"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Number of artworks to display in featured section
            </p>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <h3 className="text-lg font-medium">Feature Toggles</h3>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="enableSales"
                checked={settings.enableSales}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Enable Sales</span>
            </label>
            <p className="mt-1 text-xs text-gray-500 ml-6">
              Allow users to purchase artworks
            </p>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="enableUserRegistration"
                checked={settings.enableUserRegistration}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Enable User Registration</span>
            </label>
            <p className="mt-1 text-xs text-gray-500 ml-6">
              Allow new users to register on the site
            </p>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Maintenance Mode</span>
            </label>
            <p className="mt-1 text-xs text-gray-500 ml-6">
              Only administrators can access the site when enabled
            </p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
        </>
      )}
      
      {activeTab === 'categories' && <CategoryManager />}
    </div>
  );
};

// Category Manager Component
const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // Create categories table if it doesn't exist
      await ensureCategoriesTable();
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };
  
  const ensureCategoriesTable = async () => {
    try {
      // Check if the categories table exists
      const { error } = await supabase
        .from('categories')
        .select('id')
        .limit(1);
      
      // If we get a 'relation does not exist' error, create the table
      if (error && error.code === '42P01') {
        // We can't create tables directly with Supabase client
        // Instead, we'll use a function or trigger to create it
        // For now, we'll just create an initial category to force table creation
        const { data: _, error: insertError } = await supabase
          .from('categories')
          .insert([{ name: 'Painting', description: 'Paintings and fine art' }])
          .select();
        
        if (insertError && insertError.code !== '42P01') {
          throw insertError;
        }
      } else if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Error ensuring categories table:', error);
      // Don't throw here, we'll handle this gracefully
    }
  };
  
  const openAddForm = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryDescription('');
    setIsFormOpen(true);
  };
  
  const openEditForm = (category: Category) => {
    setEditingCategory(category);
    setCategoryName(category.name);
    setCategoryDescription(category.description || '');
    setIsFormOpen(true);
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCategory(null);
    setCategoryName('');
    setCategoryDescription('');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }
    
    try {
      setError(null);
      setSuccess(null);
      
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update({
            name: categoryName,
            description: categoryDescription || null
          })
          .eq('id', editingCategory.id);
        
        if (error) throw error;
        
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id 
            ? { ...cat, name: categoryName, description: categoryDescription } 
            : cat
        ));
        
        setSuccess('Category updated successfully');
      } else {
        // Add new category
        const { data, error } = await supabase
          .from('categories')
          .insert([{
            name: categoryName,
            description: categoryDescription || null
          }])
          .select();
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setCategories([...categories, data[0]]);
          setSuccess('Category added successfully');
        }
      }
      
      closeForm();
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error saving category:', error);
      setError(error.message || 'Failed to save category');
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    try {
      setError(null);
      setSuccess(null);
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCategories(categories.filter(cat => cat.id !== id));
      setSuccess('Category deleted successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error: any) {
      console.error('Error deleting category:', error);
      setError(error.message || 'Failed to delete category');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Manage Categories</h2>
        <button
          onClick={openAddForm}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New Category
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      {categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No categories found. Add your first category to get started.
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-md">
          <ul className="divide-y divide-gray-200">
            {categories.map(category => (
              <li key={category.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
                  {category.description && (
                    <p className="text-sm text-gray-500">{category.description}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditForm(category)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="px-3 py-1 border border-red-300 rounded-md text-sm text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
