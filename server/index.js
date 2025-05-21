require('dotenv').config();
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    
    // Allow any localhost origin
    if(origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Create a checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { cart } = req.body;
    
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      console.error('Invalid cart data:', cart);
      return res.status(400).json({ error: 'Invalid cart data' });
    }

    // Get the origin from request headers or use a default
    const origin = req.headers.origin || 'http://localhost:5173';

    // Validate cart items
    for (const item of cart) {
      if (!item.title || !item.price) {
        console.error('Invalid item data:', item);
        return res.status(400).json({ error: 'Invalid item data' });
      }
    }

    console.log('Creating line items for cart:', cart);
    
    // Create line items from cart
    const lineItems = cart.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
          description: item.dimensions && item.medium ? `${item.dimensions} - ${item.medium}` : undefined,
          // Removing images from Stripe checkout
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity || 1,
    }));

    console.log('Creating Stripe session with line items:', JSON.stringify(lineItems, null, 2));

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('Missing Stripe secret key');
      return res.status(500).json({ error: 'Stripe configuration error' });
    }

    // Create checkout session with absolute URLs
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/cart?success=true`,
      cancel_url: `${origin}/cart?canceled=true`,
    });

    console.log('Stripe session created successfully:', {
      sessionId: session.id,
      url: session.url
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error details:', {
      message: error.message,
      type: error.type,
      stack: error.stack
    });
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Stripe key available:', !!process.env.STRIPE_SECRET_KEY);
}); 