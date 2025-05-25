// Simple Express server to handle API requests during development
import express from 'express';
import cors from 'cors';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Setup __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the API route handler
const require = createRequire(import.meta.url);
const apiHandler = (await import('./api/create-checkout-session.js')).default;

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    // Forward the request to our API handler
    await apiHandler(req, res);
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API endpoint available at http://localhost:${PORT}/api/create-checkout-session`);
});
