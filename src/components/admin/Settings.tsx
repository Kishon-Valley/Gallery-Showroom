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

export const Settings: React.FC = () => {
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
    </div>
  );
};

export default Settings;
