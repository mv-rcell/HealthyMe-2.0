// services/authService.js
import { supabase } from './supabaseClient';

export const signUp = async (email, password) => {
  const { user, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return user;
};

export const logIn = async (email, password) => {
  const { user, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return user;
};

export const logOut = async () => {
  await supabase.auth.signOut();
};
