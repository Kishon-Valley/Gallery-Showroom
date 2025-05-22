// We're using a server-side checkout flow, so we don't need the client-side Stripe.js library

// Log the environment variable (without exposing the full key)
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
console.log('Stripe key available:', !!publishableKey);
console.log('Stripe key prefix:', publishableKey?.substring(0, 7));

// Note: If you need client-side Stripe functionality in the future:
// 1. Import loadStripe from '@stripe/stripe-js'
// 2. Initialize it with: const stripePromise = loadStripe(publishableKey)

// Function to handle checkout process
export async function redirectToStripeCheckout(cart: any[]) {
  try {
    // Use a relative URL that works in both development and production
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cart }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create checkout session');
    }

    const { url } = await response.json();
    
    // Redirect to Stripe checkout
    window.location.href = url;
  } catch (error) {
    console.error('Error in redirectToCheckout:', error);
    throw error;
  }
} 