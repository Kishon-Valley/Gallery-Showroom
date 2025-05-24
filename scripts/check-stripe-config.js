// Script to check Stripe configuration
// Run this with: node scripts/check-stripe-config.js

// Load environment variables from .env file
require('dotenv').config();

console.log('Checking Stripe configuration...');

// Check if Stripe keys are present (without displaying the actual keys)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const viteStripeSecretKey = process.env.VITE_STRIPE_SECRET_KEY;

console.log('STRIPE_SECRET_KEY present:', !!stripeSecretKey);
console.log('VITE_STRIPE_SECRET_KEY present:', !!viteStripeSecretKey);

// Check if any key is available for the application
const anyKeyAvailable = !!(stripeSecretKey || viteStripeSecretKey);
console.log('Any Stripe key available:', anyKeyAvailable);

if (!anyKeyAvailable) {
  console.log('\nERROR: No Stripe keys found in your environment variables!');
  console.log('Please add your Stripe secret key to your .env file like this:');
  console.log('STRIPE_SECRET_KEY=sk_test_your_test_key');
  console.log('VITE_STRIPE_SECRET_KEY=sk_test_your_test_key');
  console.log('\nMake sure to replace "sk_test_your_test_key" with your actual Stripe secret key.');
  console.log('You can find your API keys in the Stripe dashboard: https://dashboard.stripe.com/apikeys');
} else {
  console.log('\nStripe configuration check complete.');
  console.log('At least one Stripe key is configured in your environment variables.');
  
  // Verify the key format without revealing the actual key
  if (stripeSecretKey && !stripeSecretKey.startsWith('sk_')) {
    console.log('\nWARNING: Your STRIPE_SECRET_KEY does not start with "sk_". This may not be a valid Stripe secret key.');
  }
  
  if (viteStripeSecretKey && !viteStripeSecretKey.startsWith('sk_')) {
    console.log('\nWARNING: Your VITE_STRIPE_SECRET_KEY does not start with "sk_". This may not be a valid Stripe secret key.');
  }
}
