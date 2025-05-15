// src/components/AuthGate.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const AuthGate = () => {
  const { user, loading, profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/auth');
    } else if (!profile) {
      navigate('/client-onboarding');
    } else {
      navigate('/dashboard');
    }
  }, [user, profile, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-lg">
      Checking account...
    </div>
  );
};

export default AuthGate;
