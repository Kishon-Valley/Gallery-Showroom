// Vercel API route for Stripe checkout
// Use process.env directly for Vercel serverless functions
import Stripe from 'stripe';

// Initialize Stripe with the appropriate key
const stripeKey = process.env.VITE_STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;

// Check if we have a valid Stripe key
if (!stripeKey) {
  console.error('Missing Stripe secret key in environment variables');
}

const stripe = new Stripe(stripeKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if Stripe is properly initialized
    if (!stripeKey) {
      return res.status(500).json({ error: 'Stripe configuration error. Please check server logs.' });
    }
    
    const { cart } = req.body;
    
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Invalid cart data' });
    }

    // Format line items for Stripe
    const lineItems = cart.map(item => {
      // Create a product data object
      const productData = {
        name: item.title,
        description: `${item.artist}${item.dimensions ? ` - ${item.dimensions}` : ''}`,
      };
      
      // Only add images if the URL is valid and absolute
      if (item.imageUrl && (
        item.imageUrl.startsWith('http://') || 
        item.imageUrl.startsWith('https://')
      )) {
        productData.images = [item.imageUrl];
      }
      
      return {
        price_data: {
          currency: 'usd',
          product_data: productData,
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity || 1,
      };
    });

    // Get the host from the request to use for success/cancel URLs
    const host = req.headers.host;
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Create Stripe checkout session
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${baseUrl}/cart?success=true`,
        cancel_url: `${baseUrl}/cart?canceled=true`,
      });

      console.log('Stripe session created successfully');
      res.status(200).json({ url: session.url });
    } catch (stripeError) {
      console.error('Stripe API error:', stripeError.message);
      // Return a more detailed error message for debugging
      res.status(500).json({ 
        error: 'Failed to create checkout session', 
        details: stripeError.message,
        type: stripeError.type
      });
    }
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
