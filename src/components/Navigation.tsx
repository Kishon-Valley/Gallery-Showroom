import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, ShoppingCart, Heart, User, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const Navigation = () => {
  const { isDarkMode, toggleDarkMode, cart, favorites } = useAppContext();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user has admin role
  const isAdmin = user?.user_metadata?.role === 'admin';
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isActivePrefix = (prefix: string) => location.pathname.startsWith(prefix);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || isDarkMode 
          ? isDarkMode 
            ? 'bg-gray-900 shadow-md py-2' 
            : 'bg-white shadow-md py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>Art</span>
            <span className="text-blue-600">Gallery</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`${
                isActive('/') 
                  ? isDarkMode ? 'text-white font-medium' : 'text-black font-medium' 
                  : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
              } transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/gallery" 
              className={`${
                isActive('/gallery') 
                  ? isDarkMode ? 'text-white font-medium' : 'text-black font-medium' 
                  : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
              } transition-colors`}
            >
              Gallery
            </Link>
            <Link 
              to="/about" 
              className={`${
                isActive('/about') 
                  ? isDarkMode ? 'text-white font-medium' : 'text-black font-medium' 
                  : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
              } transition-colors`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`${
                isActive('/contact') 
                  ? isDarkMode ? 'text-white font-medium' : 'text-black font-medium' 
                  : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
              } transition-colors`}
            >
              Contact
            </Link>
            <Link 
              to="/ar-preview" 
              className={`${
                isActivePrefix('/ar-preview') 
                  ? isDarkMode ? 'text-white font-medium' : 'text-black font-medium' 
                  : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
              } transition-colors flex items-center`}
            >
              <span className="flex items-center">
                <Video className="w-4 h-4 mr-1" />
                <span>AR Preview</span>
              </span>
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-purple-500 text-white rounded">New</span>
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className={`${
                  isActive('/admin') 
                    ? isDarkMode ? 'text-white font-medium' : 'text-black font-medium' 
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
                } transition-colors flex items-center`}
              >
                <span className="w-5 h-5 flex items-center justify-center font-bold">⚙️</span>
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleDarkMode} 
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Favorites */}
            <Link 
              to="/favorites" 
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
              aria-label="Favorites"
            >
              <Heart className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link 
              to="/cart" 
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <div className="relative user-menu-container">
              {user ? (
                <button
                  onClick={toggleProfileMenu}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative"
                  aria-label="User profile"
                >
                  <User className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-700'}`} />
                </button>
              ) : (
                <Link
                  to="/signin"
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                  } text-white transition-colors`}
                >
                  Sign In
                </Link>
              )}
              
              {/* User Dropdown Menu */}
              {isProfileMenuOpen && user && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  } ring-1 ring-black ring-opacity-5`}
                >
                  <div className={`px-4 py-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="font-medium text-blue-600">{user.user_metadata?.full_name || user.email}</div>
                    <div className="text-sm">{user.email}</div>
                  </div>
                  <div className="border-t border-gray-700 my-1"></div>
                  <Link
                    to="/profile"
                    className={`block px-4 py-2 text-sm ${
                      isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`block px-4 py-2 text-sm ${
                        isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
              ) : (
                <Menu className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4"
          >
            <div className="flex flex-col space-y-4 pb-4">
              <Link 
                to="/" 
                className={`${
                  isActive('/') 
                    ? isDarkMode ? 'text-white font-medium' : 'text-black font-medium' 
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
                } transition-colors`}
              >
                Home
              </Link>
              <Link 
                to="/gallery" 
                className={`${
                  isActive('/gallery') 
                    ? isDarkMode ? 'text-white font-medium' : 'text-black font-medium' 
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
                } transition-colors`}
              >
                Gallery
              </Link>
              <Link 
                to="/ar-preview" 
                className={`${
                  isActivePrefix('/ar-preview') 
                    ? isDarkMode ? 'text-white font-medium' : 'text-black font-medium' 
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
                } transition-colors flex items-center`}
              >
                <Video className="w-5 h-5 mr-2" />
                <span>AR Preview</span>
                <span className="ml-2 px-1.5 py-0.5 text-xs bg-purple-500 text-white rounded">New</span>
              </Link>
              <Link 
                to="/about" 
                className={`${
                  isActive('/about') 
                    ? isDarkMode ? 'text-white font-medium' : 'text-black font-medium' 
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
                } transition-colors`}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`${
                  isActive('/contact') 
                    ? isDarkMode ? 'text-white font-medium' : 'text-black font-medium' 
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
                } transition-colors`}
              >
                Contact
              </Link>
              <Link 
                to="/favorites" 
                className={`${
                  isActive('/favorites') 
                    ? isDarkMode ? 'text-white font-medium' : 'text-black font-medium' 
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
                } transition-colors flex items-center space-x-2`}
              >
                <Heart className="w-5 h-5" />
                <span>Favorites {favorites.length > 0 && `(${favorites.length})`}</span>
              </Link>
              <Link 
                to="/cart" 
                className={`${
                  isActive('/cart') 
                    ? isDarkMode ? 'text-white font-medium' : 'text-black font-medium' 
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
                } transition-colors flex items-center space-x-2`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Cart {cart.length > 0 && `(${cart.length})`}</span>
              </Link>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      className={`${
                        isActive('/profile') 
                          ? isDarkMode ? 'text-white font-medium' : 'text-black font-medium' 
                          : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
                      } transition-colors flex items-center space-x-2`}
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className={`${
                          isActive('/admin') 
                            ? isDarkMode ? 'text-white font-medium' : 'text-black font-medium' 
                            : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
                        } transition-colors flex items-center space-x-2 mt-4`}
                      >
                        <span className="w-5 h-5 flex items-center justify-center font-bold">⚙️</span>
                        <span>Admin</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className={`${
                        isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
                      } transition-colors w-full text-left mt-4 flex items-center space-x-2`}
                    >
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signin"
                      className={`${
                        isActive('/signin') 
                          ? isDarkMode ? 'text-white font-medium' : 'text-black font-medium' 
                          : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
                      } transition-colors flex items-center space-x-2`}
                    >
                      <User className="w-5 h-5" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      to="/signup"
                      className={`${
                        isActive('/signup') 
                          ? isDarkMode ? 'text-white font-medium' : 'text-black font-medium' 
                          : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-800 hover:text-gray-600'
                      } transition-colors mt-4 block`}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};