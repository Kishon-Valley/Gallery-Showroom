import { useState, useEffect } from 'react';
import { Trash2, CreditCard, Plus, Minus } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { redirectToStripeCheckout } from '../lib/stripe';

export const Cart = () => {
  const { cart, removeFromCart, updateCartItemQuantity, cartTotal, isDarkMode } = useAppContext();
  const { loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle success/cancel messages
  useEffect(() => {
    if (searchParams.get('success')) {
      alert('Payment successful! Thank you for your purchase.');
      // You might want to clear the cart here
    }
    if (searchParams.get('canceled')) {
      alert('Payment canceled.');
    }
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      updateCartItemQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      await redirectToStripeCheckout(cart);
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('There was a problem with checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen pt-20 flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-20 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <div className={`text-center py-12 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm`}>
            <p className="text-xl mb-4">Your cart is empty</p>
            <a href="/gallery" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Browse Gallery
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className={`rounded-lg shadow-sm overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {cart.map(item => (
                    <li key={item.id} className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center">
                        <div className="w-full sm:w-24 h-24 rounded-lg overflow-hidden mr-6 mb-4 sm:mb-0">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium">{item.title}</h3>
                          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.artist}</p>
                          {item.dimensions && (
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {item.dimensions}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end mt-4 sm:mt-0">
                          <span className="text-lg font-medium mb-2">
                            {formatPrice(item.price * (item.quantity || 1))}
                          </span>
                          
                          {/* Quantity Selector */}
                          <div className="flex items-center mb-3">
                            <button
                              onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                              disabled={(item.quantity || 1) <= 1}
                              className={`p-1 rounded ${
                                (item.quantity || 1) <= 1 
                                  ? 'opacity-50 cursor-not-allowed' 
                                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                              }`}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="mx-2 w-8 text-center">{item.quantity || 1}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                              disabled={(item.quantity || 1) >= 10}
                              className={`p-1 rounded ${
                                (item.quantity || 1) >= 10 
                                  ? 'opacity-50 cursor-not-allowed' 
                                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                              }`}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className={`rounded-lg shadow-sm p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Subtotal</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>{isProcessing ? 'Processing...' : 'Proceed to Checkout'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 