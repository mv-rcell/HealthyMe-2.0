import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name?: string;
  phone_number?: string;
  role?: 'specialist' | 'client';
  created_at: string;
  specialist_type?: string;
  experience?: string;
  bio?: string;
  profile_picture_url?: string;
  membership_tier?: string;
  payment_method?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const currentUserId = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        if (process.env.NODE_ENV === 'development') {
          console.log('Auth state change:', event, currentSession?.user?.id);
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          if (
            currentUserId.current !== currentSession.user.id ||
            (!profile && !profileLoading)
          ) {
            currentUserId.current = currentSession.user.id;
            await fetchUserProfile(currentSession.user.id);
          } else {
            setLoading(false);
          }
        } else {
          currentUserId.current = null;
          setProfile(null);
          setLoading(false);
        }
      }
    );

    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error getting initial session:', error);
          setLoading(false);
          return;
        }

        if (!mounted) return;

        if (process.env.NODE_ENV === 'development') {
          console.log('Initial session check:', currentSession?.user?.id);
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          currentUserId.current = currentSession.user.id;
          await fetchUserProfile(currentSession.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setProfileLoading(true);
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('Fetching profile for user:', userId);
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('No profile found. Optionally creating one...');
          await createEmptyProfile(userId); // optional fallback
        } else {
          console.error('Error fetching user profile:', error);
          setProfile(null);
        }
      } else if (!data) {
        console.warn('Profile is empty.');
        setProfile(null);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('Profile fetched:', data);
        }
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setProfile(null);
    } finally {
      setProfileLoading(false);
      setLoading(false);
    }
  };

  const createEmptyProfile = async (userId: string) => {
    try {
      const { error } = await supabase.from('profiles').insert({
        id: userId,
        full_name: null,
        phone_number: null,
        role: null,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Error creating empty profile:', error);
      } else {
        // Fetch the newly created profile
        await fetchUserProfile(userId);
      }
    } catch (error) {
      console.error('Error inserting fallback profile:', error);
    }
  };

  const refreshSession = async () => {
    const { data: refreshedSession, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error refreshing session:', error);
    } else {
      setSession(refreshedSession.session);
      setUser(refreshedSession.session?.user ?? null);
      if (refreshedSession.session?.user?.id) {
        await fetchUserProfile(refreshedSession.session.user.id);
      }
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      currentUserId.current = null;
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    user,
    session,
    loading,
    profile,
    profileLoading,
    signOut,
    refreshSession,
    isSpecialist: profile?.role === 'specialist',
    isClient: profile?.role === 'client',
    isLoggedIn: !!user,
  };
}
