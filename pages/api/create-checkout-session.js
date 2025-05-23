// Vercel API route for Stripe checkout
import Stripe from 'stripe';

// Initialize Stripe with the appropriate key
// Make sure STRIPE_SECRET_KEY is set in your .env file
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('Missing Stripe secret key in environment variables');
}

const stripe = new Stripe(stripeSecretKey);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/cart?success=true`,
      cancel_url: `${baseUrl}/cart?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
