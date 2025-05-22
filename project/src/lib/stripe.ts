// Import the Stripe client library
import { loadStripe } from '@stripe/stripe-js';

// Log the environment variable (without exposing the full key)
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
console.log('Stripe key available:', !!publishableKey);
console.log('Stripe key prefix:', publishableKey?.substring(0, 7));

// Initialize Stripe
const stripePromise = loadStripe(publishableKey);

// Function to handle checkout process
export async function redirectToStripeCheckout(cart: any[]) {
  try {
    console.log('Starting checkout process with cart:', cart.length, 'items');
    
    if (!cart || cart.length === 0) {
      throw new Error('Cart is empty');
    }
    
    // Get the Stripe instance
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Failed to initialize Stripe');
    }
    
    // Format line items for Stripe
    const lineItems = cart.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          description: `${item.artist}${item.dimensions ? ` - ${item.dimensions}` : ''}`,
          images: item.imageUrl ? [item.imageUrl] : [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity || 1,
    }));
    
    // Create a Checkout Session
    const { error } = await stripe.redirectToCheckout({
      mode: 'payment',
      lineItems: lineItems,
      successUrl: `${window.location.origin}/cart?success=true`,
      cancelUrl: `${window.location.origin}/cart?canceled=true`,
    });
    
    if (error) {
      console.error('Stripe Checkout error:', error);
      throw new Error(error.message || 'Failed to redirect to Stripe Checkout');
    }
  } catch (error) {
    console.error('Error in redirectToCheckout:', error);
    throw error;
  }
} 