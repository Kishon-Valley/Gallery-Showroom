// Function to handle checkout process using our API route
export async function redirectToStripeCheckout(cart: any[]) {
  try {
    console.log('Starting checkout process with cart items:', cart);
    
    if (!cart || cart.length === 0) {
      throw new Error('Cart is empty');
    }
    
    // Call our API route to create a checkout session
    // Always use the relative path for API endpoint - works for both local and Vercel deployment
    const apiUrl = '/api/create-checkout-session';
    console.log('Using API endpoint:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cart }),
    });
    
    // Log the response status and headers for debugging
    console.log('Checkout session response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
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
    
    // Show more specific error message based on the error type
    let errorMessage = 'We are experiencing issues with our payment processor. Please try again later.';
    
    if (error instanceof Error) {
      // Log detailed error for debugging
      console.error('Error details:', error.message);
      
      // Check for common error cases
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        errorMessage = 'Network error: Unable to connect to the payment service. Please check your internet connection and try again.';
      } else if (error.message.includes('Stripe configuration error')) {
        errorMessage = 'Payment service configuration error. Please contact support.';
      }
    }
    
    alert(errorMessage);
    throw error;
  }
}