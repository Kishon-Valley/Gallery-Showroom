import { motion } from 'framer-motion';
import { User, Mail, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Profile = () => {
  const { isDarkMode } = useAppContext();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const profileData = {
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    fullName: user?.user_metadata?.full_name || user?.user_metadata?.name || '',
    email: user?.email || ''
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get the sign-in method
  const getSignInMethod = () => {
    if (user?.app_metadata?.provider === 'google') {
      return 'Google';
    }
    return 'Email';
  };
  
  return (
    <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className={`rounded-lg shadow-lg p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Profile</h1>
                <button
                onClick={handleLogout}
                className="flex items-center text-red-500 hover:text-red-600"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
                </button>
            </div>
            
            <div className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center space-x-4">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <User className="w-12 h-12 text-gray-400" />
                  </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {profileData.firstName && profileData.lastName 
                      ? `${profileData.firstName} ${profileData.lastName}`
                      : profileData.fullName || 'User'}
                  </h2>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Mail className="w-4 h-4 inline mr-2" />
                    {profileData.email}
                  </p>
                </div>
              </div>

              {/* Account Info */}
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h3 className="font-medium mb-2">Account Information</h3>
                <div className="space-y-2">
                  <p>
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Sign in method: </span>
                    <span className="font-medium">{getSignInMethod()}</span>
                  </p>
                  <p>
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Account created: </span>
                    <span className="font-medium">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </p>
                  {user?.email_confirmed_at && (
                    <p>
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email verified: </span>
                      <span className="font-medium">
                        {new Date(user.email_confirmed_at).toLocaleDateString()}
                      </span>
                    </p>
                  )}
                  </div>
                </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 