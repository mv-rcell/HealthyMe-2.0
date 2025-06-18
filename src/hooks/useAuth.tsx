import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  role: 'specialist' | 'client' | null;
  created_at: string;
  specialist_type: string | null;
  experience: string | null;
  bio: string | null;
  profile_picture_url: string | null;
  membership_tier: string | null;
  payment_method: string | null;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Prevent multiple profile fetches
  const hasFetchedProfile = useRef(false);

  useEffect(() => {
    // Auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state change:', event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user && !hasFetchedProfile.current) {
          fetchUserProfile(currentSession.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user && !hasFetchedProfile.current) {
        fetchUserProfile(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    if (hasFetchedProfile.current) return;

    setProfileLoading(true);
    hasFetchedProfile.current = true;

    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        setProfile(null);
      } else {
        console.log('Profile fetched:', data);
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

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    hasFetchedProfile.current = false;
  };

  return {
    user,
    session,
    loading,
    signOut,
    profile,
    profileLoading,
    isSpecialist: profile?.role === 'specialist',
    isClient: profile?.role === 'client',
    fetchProfile: fetchUserProfile,
  };
}
