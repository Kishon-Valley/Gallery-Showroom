# Art Gallery Application

This is a web application for an art gallery that allows users to browse artwork, add items to cart, save favorites, and preview artwork in AR.

## Features

- User authentication (email/password)
- Email verification
- Password reset
- User profile management
- Art gallery with filtering and search
- Shopping cart functionality
- Favorites collection
- AR preview of artwork

## Current Implementation

The application currently uses Supabase for backend services including authentication, database, and storage. It's ready for production deployment.

## Deployment

### Deploying to Vercel

1. Install the Vercel CLI:
```bash
npm install -g vercel
```

2. Login to your Vercel account:
```bash
vercel login
```

3. Deploy the project:
```bash
vercel
```

4. During deployment, you'll need to add the following environment variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
- `VITE_STRIPE_PUBLIC_KEY` - Your Stripe publishable key

The deployment URL will be provided after the build process completes.

## Development

To run the project locally:
```bash
npm install
npm run dev
```

## Implementing Firebase Authentication

To replace the mock authentication with Firebase, follow these steps:

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once your project is created, click on "Web" to add a web app to your project
4. Register your app with a nickname (e.g., "Art Gallery")
5. Copy the Firebase configuration object for later use

### 2. Install Firebase SDK

```bash
npm install firebase
# or
yarn add firebase
```

### 3. Create a Firebase Configuration File

Create a new file at `src/firebase/config.ts`:

```typescript

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
```

### 4. Update AuthContext.tsx

The `AuthContext.tsx` file already contains commented code for Firebase implementation. To enable it:

1. Import the Firebase auth functions at the top of the file:

```typescript
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateEmail,
  updateProfile as firebaseUpdateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';
```

2. Set `IS_DEVELOPMENT` to `false` to use the Firebase implementation instead of the mock one.

3. Uncomment the Firebase implementation code in each function (login, signup, logout, etc.).

### 5. Testing Firebase Authentication

1. Make sure your Firebase project has Email/Password authentication enabled:
   - In the Firebase Console, go to Authentication > Sign-in method
   - Enable Email/Password provider

2. Test the authentication flow:
   - Sign up with a new email
   - Verify the email (check your inbox)
   - Sign in with the verified email
   - Test password reset functionality

## Development vs Production

The application is designed to work in two modes:

- **Development Mode** (`IS_DEVELOPMENT = true`): Uses mock authentication stored in localStorage
- **Production Mode** (`IS_DEVELOPMENT = false`): Uses Firebase authentication

You can switch between these modes by changing the `IS_DEVELOPMENT` constant in `AuthContext.tsx`.

## Additional Firebase Features

Once you have basic authentication working, you might want to add:

1. **Firestore Database**: Store user data, artwork, cart, and favorites
2. **Firebase Storage**: Store artwork images
3. **Firebase Hosting**: Deploy your application
4. **Firebase Functions**: Implement serverless functions for backend logic

## Demo Account

For testing purposes, the application includes a demo account:
- Email: demo@example.com
- Password: Password123

This account is automatically created in the mock database and can be used to test the application without signing up. 