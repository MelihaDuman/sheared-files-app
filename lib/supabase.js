import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
// import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://cfgctueepeqywhhtgnza.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZ2N0dWVlcGVxeXdoaHRnbnphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5ODQ0NzksImV4cCI6MjA2MjU2MDQ3OX0.Y6ZiF9ffD4ypSXlUb4Wdz_VYRyrQwGU9k55n4PC4Iug';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // important for mobile apps
  },
});
