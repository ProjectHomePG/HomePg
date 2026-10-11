import { createClient } from '../utils/supabase/client';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Singleton browser client (cookie-based session, refreshed by middleware).
export const supabase = createClient();
