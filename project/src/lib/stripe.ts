// Import the Stripe client library
import { loadStripe } from '@stripe/stripe-js';

// Use the publishable key directly to ensure it's available
// This is your Stripe publishable key from the .env file
const publishableKey = 'pk_test_51RNgZXGdQYCer7LxQnffQx69xI4ucxZNzM383NkZpPha40g7DTP1MNUH95HaxKQ9yDnvoKQiiCXQTYf2ZUCWdex400ifj489UG';

// Log key information for debugging
console.log('Using Stripe key with prefix:', publishableKey.substring(0, 12));

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(publishableKey);

// Function to handle checkout process - using a very simple approach
export async function redirectToStripeCheckout(cart: any[]) {
  try {
    console.log('Starting checkout process with cart items:', cart);
    
    if (!cart || cart.length === 0) {
      throw new Error('Cart is empty');
    }
    
    // Get the Stripe instance
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Failed to initialize Stripe');
    }
    
    // Calculate the total amount
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    console.log('Total amount for checkout:', totalAmount);
    
    // Use a direct approach with Stripe Checkout
    // We'll create a session directly on their server
    try {
      // First, create a session on Stripe's servers
      const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${publishableKey}`,
        },
        body: new URLSearchParams({
          'success_url': `${window.location.origin}/cart?success=true`,
          'cancel_url': `${window.location.origin}/cart?canceled=true`,
          'payment_method_types[0]': 'card',
          'mode': 'payment',
          'line_items[0][price_data][currency]': 'usd',
          'line_items[0][price_data][unit_amount]': Math.round(totalAmount * 100).toString(),
          'line_items[0][price_data][product_data][name]': 'Art Gallery Purchase',
          'line_items[0][quantity]': '1'
        }).toString()
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Stripe session creation failed:', errorText);
        throw new Error('Failed to create checkout session');
      }
      
      const session = await response.json();
      console.log('Created Stripe session:', session.id);
      
      // Redirect to the session URL
      window.location.href = session.url;
      
    } catch (sessionError) {
      console.error('Session creation error:', sessionError);
      
      // Fallback to a very simple approach if the session creation fails
      alert('We are experiencing issues with our payment processor. Please try again later.');
      throw sessionError;
    }
  } catch (error) {
    console.error('Error in redirectToCheckout:', error);
    throw error;
  }
}