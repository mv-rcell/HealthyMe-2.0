import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState<'specialist' | 'client' | 'fitness_trainer'>('client');
  const [loading, setLoading] = useState(false);

  // Forgot / Reset states
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') === 'signup' ? 'signup' : 'signin'
  );

  useEffect(() => {
    if (user && !authLoading && activeTab !== 'reset-password') {
      navigate('/');
    }
  }, [user, authLoading, activeTab, navigate]);
  

  // Auto-open reset-password tab if coming from Supabase reset link
  useEffect(() => {
    if (searchParams.get('reset') === 'true') {
      setActiveTab('reset-password');
    }
  }, [searchParams]);

  // Check reset session validity when on reset-password tab
  useEffect(() => {
    if (activeTab === 'reset-password') {
      supabase.auth.getSession().then(({ data }) => {
        if (!data.session) {
          toast.error("Your reset link has expired. Please request a new one.");
          setActiveTab('forgot');
        }
      });
    }
  }, [activeTab]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Successfully signed in!');
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      if (data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
          
        if (profileData?.role === 'specialist' || profileData?.role === 'fitness_trainer') {
          navigate('/specialist-dashboard');
        } else if (profileData?.role === 'client') {
          navigate('/client-dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      toast.error(`Error signing in: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        await supabase
          .from('profiles')
          .update({ 
            phone_number: phoneNumber,
            role: role 
          })
          .eq('id', data.user.id);
        
        toast.success('Registration successful! Redirecting to onboarding...');
        
        if (role === 'specialist' || role === 'fitness_trainer') {
          navigate('/specialist-onboarding');
        } else {
          navigate('/client-onboarding');
        }
      }
    } catch (error: any) {
      toast.error(`Error signing up: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: ` http://127.0.0.1:4040 /auth?reset=true`,
      });
      

      if (error) throw error;

      setResetSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (error: any) {
      toast.error(`Error sending reset email: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetting(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error("Reset session expired. Please request a new link.");
      }

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      toast.success('Password updated! Please log in.');
      setActiveTab('signin');
    } catch (error: any) {
      toast.error(error.message || 'Error updating password.');
      setActiveTab('forgot');
    } finally {
      setResetting(false);
    }
  };

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">HealthyMe</h1>
          <p className="mt-2 text-gray-600">Sign in to your account or create a new one</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="forgot">Forgot</TabsTrigger>
          </TabsList>

          {/* Sign In */}
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <div className="text-center">
                <Button variant="link" className="text-sm" onClick={() => setActiveTab('forgot')}>
                  Forgot your password?
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* Sign Up */}
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="+254712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>I am a:</Label>
                <RadioGroup 
                  value={role} 
                  onValueChange={(value) => setRole(value as 'specialist' | 'client' | 'fitness_trainer')}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="client" id="client" />
                    <Label htmlFor="client">Client</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="specialist" id="specialist" />
                    <Label htmlFor="specialist">Health Specialist</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fitness_trainer" id="fitness_trainer" />
                    <Label htmlFor="fitness_trainer">Fitness Trainer</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </TabsContent>

          {/* Forgot Password */}
          <TabsContent value="forgot">
            {!resetSent ? (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">Reset Your Password</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@example.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    Reset Link Sent!
                  </h3>
                  <p className="text-sm text-green-700">
                    We've sent a password reset link to <strong>{resetEmail}</strong>. 
                    Check your email and click the link to reset your password.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
                    Didn't receive the email? Check your spam folder or
                  </p>
                  <Button 
                    variant="link" 
                    className="text-sm"
                    onClick={() => setResetSent(false)}
                  >
                    Try again
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Reset Password (after clicking email link) */}
          <TabsContent value="reset-password">
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={resetting}>
                {resetting ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <Button variant="link" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
