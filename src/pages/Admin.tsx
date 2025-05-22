import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dashboard, ArtworkManager, UserManager, Settings } from '../components/admin';
import { supabase } from '../lib/supabase';

// Admin page tabs
enum AdminTab {
  DASHBOARD = 'Dashboard',
  ARTWORKS = 'Artworks',
  USERS = 'Users',
  SETTINGS = 'Settings'
}

export const Admin: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>(AdminTab.DASHBOARD);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  
  // Debug information
  console.log('Admin page - User data:', user);
  console.log('Admin page - Authentication status:', isAuthenticated);
  
  // Check if user is admin in the database
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setCheckingRole(false);
        return;
      }
      
      try {
        // First check if this is the specific admin user
        const isSpecificAdmin = user.id === '291d1e26-93e7-458b-9d37-6cb245aef567' && 
                               user.email === 'recyclips21@gmail.com';
        
        console.log('Checking specific admin:', isSpecificAdmin, user.id);
        
        if (isSpecificAdmin) {
          setIsAdmin(true);
          setCheckingRole(false);
          return;
        }
        
        // Check the profiles table for admin role
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error checking admin role in profiles:', error);
          // If there's an error, we'll just set isAdmin to false
          setIsAdmin(false);
        } else {
          console.log('User database data from profiles table:', data);
          setIsAdmin(data?.role === 'admin');
        }
      } catch (err) {
        console.error('Error in admin check:', err);
        setIsAdmin(false);
      } finally {
        setCheckingRole(false);
      }
    };
    
    checkAdminRole();
  }, [user]);
  
  console.log('Admin page - Is admin:', isAdmin);
  
  if (loading || checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Redirect non-admin users
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {Object.values(AdminTab).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Content based on active tab */}
      <div className="mt-6">
        {activeTab === AdminTab.DASHBOARD && <Dashboard />}
        {activeTab === AdminTab.ARTWORKS && <ArtworkManager />}
        {activeTab === AdminTab.USERS && <UserManager />}
        {activeTab === AdminTab.SETTINGS && <Settings />}
      </div>
    </div>
  );
};



export default Admin;
