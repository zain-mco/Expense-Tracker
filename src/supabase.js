import { createClient } from '@supabase/supabase-js';

// Access environment variables using Vite's import.meta.env, falling back to your provided credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uktmftlstrdrhkegjfru.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_IO-vjUnP6YxU_v0U8bWACA_X3jwHSWZ';

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
