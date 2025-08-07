import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, CheckCircle } from 'lucide-react';

export const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg shadow-lg p-8 bg-white dark:bg-gray-800"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              <User className="w-10 h-10 text-gray-500 dark:text-gray-400" />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                {user.user_metadata?.full_name || user.email}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {user.email}
              </p>
            </div>
          </div>

          {/* Account Details */}
          <div className="mt-8 space-y-6">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center space-x-3 mb-2">
                <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Sign in method: </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {user.app_metadata?.provider === 'google' ? 'Google' : 'Email'}
                </span>
              </div>
              <div className="flex items-center space-x-3 mb-2">
                <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Account created: </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatDate(user.created_at)}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Email verified: </span>
                <span className={`font-medium ${user.email_confirmed_at ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {user.email_confirmed_at ? 'Yes' : 'No'}
                </span>
              </div>
            </div>

            {/* Additional Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
                  Account Features
                </h3>
                <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                  <li>• Secure authentication</li>
                  <li>• Profile management</li>
                  <li>• Order history</li>
                  <li>• Favorite artworks</li>
                </ul>
              </div>

              <div className="p-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold mb-2 text-green-900 dark:text-green-100">
                  Gallery Access
                </h3>
                <ul className="space-y-2 text-green-800 dark:text-green-200">
                  <li>• Browse all artworks</li>
                  <li>• Add to favorites</li>
                  <li>• AR preview mode</li>
                  <li>• Secure checkout</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 