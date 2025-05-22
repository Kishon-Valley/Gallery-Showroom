import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const VerifyEmail = () => {
  const { isDarkMode } = useAppContext();
  const { user, isAuthenticated, sendVerificationEmail, verifyEmail, isVerificationEmailSent } = useAuth();
  const navigate = useNavigate();
  
  const [isEmailSent, setIsEmailSent] = useState(isVerificationEmailSent);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  
  // Handle countdown timer for resending verification email
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  // Check if user is already verified
  useEffect(() => {
    if (user?.user_metadata?.isEmailVerified) {
      setVerificationSuccess(true);
    }
  }, [user]);
  
  // Set initial email sent state based on context
  useEffect(() => {
    setIsEmailSent(isVerificationEmailSent);
  }, [isVerificationEmailSent]);
  
  // Handle verification from URL token (simulated)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token && isAuthenticated && user && !user.user_metadata?.isEmailVerified) {
      const verifyWithToken = async () => {
        setVerifying(true);
        try {
          await verifyEmail();
          setVerificationSuccess(true);
        } catch (err) {
          setError('Invalid or expired verification link. Please request a new one.');
        } finally {
          setVerifying(false);
        }
      };
      
      verifyWithToken();
    }
  }, [isAuthenticated, user, verifyEmail]);
  
  const handleSendVerification = async () => {
    if (countdown > 0) return;
    
    setError(null);
    try {
      await sendVerificationEmail();
      setIsEmailSent(true);
      setCountdown(60); // 60 second cooldown
    } catch (err) {
      setError('Failed to send verification email. Please try again.');
    }
  };
  
  // If user is not logged in
  if (!isAuthenticated || !user) {
    return (
      <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <div className={`rounded-lg shadow-lg p-8 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              
              <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
              
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                You need to be signed in to verify your email address.
              </p>
              
              <div className="flex flex-col space-y-4">
                <Link
                  to="/signin"
                  className="w-full py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors text-center"
                >
                  Sign In
                </Link>
                
                <Link
                  to="/"
                  className="flex items-center justify-center text-blue-600 hover:underline"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Gallery
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  // If email is already verified
  if (verificationSuccess) {
    return (
      <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md mx-auto"
          >
            <div className={`rounded-lg shadow-lg p-8 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h1 className="text-2xl font-bold mb-4">Email Verified!</h1>
              
              <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your email address <span className="font-medium">{user.email}</span> has been successfully verified.
                You now have full access to all features.
              </p>
              
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  Continue to Gallery
                </button>
                
                <Link
                  to="/profile"
                  className="text-blue-600 hover:underline"
                >
                  Go to Profile
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  // Email verification prompt
  return (
    <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className={`rounded-lg shadow-lg p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            
            <h1 className="text-2xl font-bold mb-4 text-center">Verify Your Email</h1>
            
            {verifying ? (
              <div className="text-center py-4">
                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Verifying your email...</p>
              </div>
            ) : (
              <>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  We need to verify your email address <span className="font-medium">{user.email}</span>.
                  {isEmailSent 
                    ? " We've sent you a verification link. Please check your inbox and click the link to verify your email."
                    : " Please click the button below to receive a verification link."}
                </p>
                
                {error && (
                  <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">
                    <p className="flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      {error}
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={handleSendVerification}
                    disabled={countdown > 0}
                    className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
                      countdown > 0 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isEmailSent 
                      ? countdown > 0 
                        ? `Resend Email (${countdown}s)` 
                        : 'Resend Verification Email'
                      : 'Send Verification Email'}
                  </button>
                  
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'}`}>
                    <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                      <strong>Note:</strong> Some features like adding items to cart or favorites will be limited until you verify your email.
                    </p>
                  </div>
                  
                  <div className="flex justify-between">
                    <Link
                      to="/"
                      className="flex items-center text-blue-600 hover:underline"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back to Gallery
                    </Link>
                    
                    <Link
                      to="/profile"
                      className="text-blue-600 hover:underline"
                    >
                      Go to Profile
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}; 