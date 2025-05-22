import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface DashboardStats {
  totalArtworks: number;
  totalUsers: number;
  totalSales: number;
  recentActivity: Array<{
    id: string;
    description: string;
    timestamp: string;
    type: 'sale' | 'user' | 'artwork';
  }>;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalArtworks: 0,
    totalUsers: 0,
    totalSales: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch artwork count
      const { count: artworkCount, error: artworkError } = await supabase
        .from('artworks')
        .select('*', { count: 'exact', head: true });
      
      if (artworkError) throw artworkError;
      
      // Fetch user count (simplified for demo)
      const { count: userCount, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
        
      if (userError) throw userError;
      
      // Fetch sales count (assuming you have an orders table)
      const { count: salesCount, error: salesError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
        
      if (salesError) {
        // If table doesn't exist yet, just use 0
        console.warn('Orders table may not exist yet:', salesError);
      }
      
      // Fetch recent activity (simplified for demo)
      const { data: recentArtworks, error: recentArtworksError } = await supabase
        .from('artworks')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (recentArtworksError) throw recentArtworksError;
      
      // Transform data for the dashboard
      const recentActivity = [
        ...(recentArtworks || []).map(artwork => ({
          id: artwork.id,
          description: `New artwork added: ${artwork.title}`,
          timestamp: artwork.created_at,
          type: 'artwork' as const
        }))
      ];
      
      setStats({
        totalArtworks: artworkCount || 0,
        totalUsers: userCount || 0,
        totalSales: salesCount || 0,
        recentActivity
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
      <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard 
          title="Total Artworks" 
          value={stats.totalArtworks.toString()} 
          icon="🖼️" 
        />
        <DashboardCard 
          title="Total Users" 
          value={stats.totalUsers.toString()} 
          icon="👥" 
        />
        <DashboardCard 
          title="Total Sales" 
          value={stats.totalSales.toString()} 
          icon="💰" 
        />
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {stats.recentActivity.length === 0 ? (
            <p className="p-6 text-gray-500">No recent activity found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {stats.recentActivity.map(activity => (
                <li key={activity.id} className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="mr-3">
                      {activity.type === 'artwork' && '🖼️'}
                      {activity.type === 'user' && '👤'}
                      {activity.type === 'sale' && '💵'}
                    </span>
                    <div>
                      <p className="text-sm text-gray-800">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  icon: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="text-3xl mr-4">{icon}</div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
