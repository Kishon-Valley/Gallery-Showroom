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
    
    // Log the response status for debugging
    console.log('Checkout session response status:', response.status);
    
    if (!response.ok) {
      let errorMessage = 'Failed to create checkout session';
      try {
        const errorData = await response.json();
        console.error('Checkout session creation failed:', errorData);
        errorMessage = errorData.error || errorMessage;
      } catch (parseError) {
        console.error('Could not parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }
    
    const { url } = await response.json();
    console.log('Received checkout URL, redirecting...');
    
    // Redirect to Stripe Checkout
    window.location.href = url;
    
  } catch (error) {
    console.error('Error in redirectToCheckout:', error);
    alert('We are experiencing issues with our payment processor. Please try again later.');
    throw error;
  }
}