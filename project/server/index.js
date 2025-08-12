// Load environment variables from parent directory's .env file
require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');

// Prefer STRIPE_SECRET_KEY; fallback to VITE_STRIPE_SECRET_KEY for local dev
const stripeKey = process.env.STRIPE_SECRET_KEY || process.env.VITE_STRIPE_SECRET_KEY;
console.log('Stripe key available:', !!stripeKey);

if (!stripeKey) {
  console.error('ERROR: Stripe secret key not found in environment variables');
  console.error('Please make sure VITE_STRIPE_SECRET_KEY is set in the .env file');
}

const stripe = require('stripe')(stripeKey);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Create checkout session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
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

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/cart?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
