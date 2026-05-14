import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gvmvtbekcwsbxjnpimxl.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2bXZ0YmVrY3dzYnhqbnBpbXhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODIwMDYsImV4cCI6MjA5NDM1ODAwNn0.Z5_Z3YrY4-bmJglHszyZ7YvQxlwC0GVQKTCBClC1xcU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
