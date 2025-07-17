import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  [x: string]: null;
  [x: string]: any[];
  [x: string]: null;
  age: null;
  gender: null;
  health_conditions: any[];
  location: string;
  consultation_fee: any;
  subsequent_visits_fee: any;
  languages: any;
  availability: string;
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

  const hasFetchedProfile = useRef<string | null>(null);

  const fetchUserProfile = async (userId: string) => {
    // Prevent duplicate calls for same user
    if (hasFetchedProfile.current === userId) return;

    setProfileLoading(true);
    console.log('Fetching profile for user:', userId);

    try {
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
        hasFetchedProfile.current = userId;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setProfile(null);
    } finally {
      setProfileLoading(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleSession = async (currentSession: Session | null) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id);
      } else {
        setProfile(null);
        hasFetchedProfile.current = null;
        setLoading(false);
      }
    };

    // Initial session
    supabase.auth.getSession().then(({ data }) => {
      console.log('Initial session check:', data.session?.user?.id);
      handleSession(data.session);
    });

    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state change:', _event, session?.user?.id);
      handleSession(session);
    }).data;

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    hasFetchedProfile.current = null;
  };

  return {
    user,
    session,
    loading,
    profile,
    profileLoading,
    signOut,
    isSpecialist: profile?.role === 'specialist',
    isClient: profile?.role === 'client',
    fetchProfile: fetchUserProfile,
  };
}
