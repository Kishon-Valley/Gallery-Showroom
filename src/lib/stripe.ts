// Function to handle checkout process using our API route

// Function to handle checkout process using our API route
export async function redirectToStripeCheckout(cart: any[]) {
  try {
    console.log('Starting checkout process with cart items:', cart);
    
    if (!cart || cart.length === 0) {
      throw new Error('Cart is empty');
    }
    
    // Call our API route to create a checkout session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cart }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Checkout session creation failed:', errorData);
      throw new Error(errorData.error || 'Failed to create checkout session');
    }
    
    const { url } = await response.json();
    
    // Redirect to Stripe Checkout
    window.location.href = url;
    
  } catch (error) {
    console.error('Error in redirectToCheckout:', error);
    alert('We are experiencing issues with our payment processor. Please try again later.');
    throw error;
  }
}