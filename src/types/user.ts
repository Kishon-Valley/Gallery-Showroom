import { User as SupabaseUser } from '@supabase/supabase-js';

// Extend the Supabase User type to include our custom properties
export interface User extends SupabaseUser {
  user_metadata: {
    isEmailVerified?: boolean;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    role?: string;
    [key: string]: any;
  };
  // Adding role at the root level as well
  role?: string;
}
