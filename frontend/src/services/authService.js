import { supabase } from '../lib/supabase';

const USER_KEY = 'user';
const TOKEN_KEY = 'token';

async function fetchProfile(authId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, name, email, phone, role, bio, city, profile_picture, created_at')
    .eq('auth_id', authId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Profile not found for this account.');
  return data;
}

function storeSession(user, accessToken) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, accessToken || 'supabase-session');
  }
}

export const authService = {
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message || 'Login failed.');
    const profile = await fetchProfile(data.user.id);
    storeSession(profile, data.session?.access_token);
    return profile;
  },

  register: async (name, email, password, phone, role = 'ROLE_USER') => {
    // Only user/owner can be self-selected; admin must be granted manually.
    const safeRole = role === 'ROLE_OWNER' ? 'ROLE_OWNER' : 'ROLE_USER';
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, role: safeRole },
      },
    });
    if (error) throw new Error(error.message || 'Registration failed.');

    if (!data.session) {
      throw new Error(
        'Account created. Confirm your email address, then sign in.'
      );
    }
    const profile = await fetchProfile(data.user.id);
    storeSession(profile, data.session.access_token);
    return profile;
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out failed:', err.message);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
    return true;
  },

  getCurrentUser: () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem(TOKEN_KEY) !== null &&
        localStorage.getItem(USER_KEY) !== null
      );
    }
    return false;
  },
};

export default authService;
