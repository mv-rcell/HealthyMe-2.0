import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '@/assets/logo.png';

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
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(searchParams.get('reset') === 'true');
  const [activeTab, setActiveTab] = useState(
    searchParams.get('tab') === 'signup'
      ? 'signup'
      : searchParams.get('reset') === 'true'
      ? 'forgot'
      : 'signin'
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const handleAuthStateChange = () => {
      supabase.auth.onAuthStateChange((event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setIsResetting(true);
          setActiveTab('forgot');
        }
      });
    };
    handleAuthStateChange();

    if (user && !authLoading && !isResetting) {
      navigate('/');
    }
  }, [user, authLoading, navigate, isResetting]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
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
        options: { data: { full_name: fullName, role } },
      });
      if (error) throw error;

      if (data.user) {
        await supabase.from('profiles').update({ phone_number: phoneNumber, role }).eq('id', data.user.id);
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
        redirectTo:
          process.env.NODE_ENV === 'production'
            ? 'https://healthy-me-2-0-marcells-projects-c92f7e38.vercel.app/auth?reset=true'
            : 'http://localhost:3000/auth?reset=true',
      });
      if (error) throw error;
      setResetSent(true);
      toast.success('Password reset link sent!');
    } catch (error: any) {
      toast.error(`Error sending reset email: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password updated successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(`Error updating password: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  const PasswordInput = ({
    value,
    onChange,
    show,
    toggle,
    placeholder = 'Password',
    id,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    show: boolean;
    toggle: () => void;
    placeholder?: string;
    id: string;
  }) => (
    <div className="relative space-y-2">
      <Label htmlFor={id} className="text-sm text-muted-foreground">
        {placeholder}
      </Label>
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        className="h-12 rounded-lg border border-border bg-background"
        required
      />
      <button
        type="button"
        className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
        onClick={toggle}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-sm p-8 space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 mb-4 flex items-center justify-center">
            <img src={Logo} alt="HealthyMe Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">HealthyMe</h1>
        </div>

        {/* Sign In */}
        {activeTab === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="signin-email" className="text-sm text-muted-foreground">
                Email Address
              </Label>
              <Input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-lg border border-border bg-background"
                required
              />
            </div>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              show={showPassword}
              toggle={() => setShowPassword(!showPassword)}
              id="signin-password"
              placeholder="Password"
            />
            <div className="text-right">
              <Button
                variant="link"
                className="text-sm text-purple-600 hover:text-purple-700 p-0 h-auto"
                onClick={() => setActiveTab('forgot')}
                type="button"
              >
                Forgot Password?
              </Button>
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Login'}
            </Button>
            <div className="text-center pt-4">
              <span className="text-sm text-muted-foreground">Don't have an account? </span>
              <Button
                variant="link"
                className="text-purple-600 hover:text-purple-700 text-sm p-0 h-auto font-medium"
                onClick={() => setActiveTab('signup')}
                type="button"
              >
                Sign Up
              </Button>
            </div>
          </form>
        )}

        {/* Sign Up */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold">Create Account</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-sm text-muted-foreground">
                  Email Address
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-lg border border-border bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full-name" className="text-sm text-muted-foreground">
                  Full Name
                </Label>
                <Input
                  id="full-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12 rounded-lg border border-border bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone-number" className="text-sm text-muted-foreground">
                  Phone Number
                </Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="+254712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-12 rounded-lg border border-border bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">I am a:</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) => setRole(value as 'specialist' | 'client' | 'fitness_trainer')}
                  className="flex flex-col space-y-2"
                >
                  {[
                    { value: 'client', label: 'Client' },
                    { value: 'specialist', label: 'Health Specialist' },
                    { value: 'fitness_trainer', label: 'Fitness Trainer' },
                  ].map((r) => (
                    <div key={r.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={r.value} id={r.value} />
                      <Label htmlFor={r.value} className="text-sm">
                        {r.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                show={showPassword}
                toggle={() => setShowPassword(!showPassword)}
                id="signup-password"
                placeholder="Password"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
            <div className="text-center pt-4">
              <span className="text-sm text-muted-foreground">Already have an account? </span>
              <Button
                variant="link"
                className="text-purple-600 hover:text-purple-700 text-sm p-0 h-auto font-medium"
                onClick={() => setActiveTab('signin')}
                type="button"
              >
                Sign In
              </Button>
            </div>
          </form>
        )}

        {/* Forgot Password */}
        {activeTab === 'forgot' && (
          <div className="space-y-6">
            {isResetting ? (
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold">Set New Password</h2>
                  <p className="text-sm text-muted-foreground mt-2">Enter your new password below.</p>
                </div>
                <PasswordInput
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  show={showNewPassword}
                  toggle={() => setShowNewPassword(!showNewPassword)}
                  id="new-password"
                  placeholder="New Password"
                />
                <PasswordInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  show={showConfirmPassword}
                  toggle={() => setShowConfirmPassword(!showConfirmPassword)}
                  id="confirm-password"
                  placeholder="Confirm New Password"
                />
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            ) : !resetSent ? (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold">Reset Your Password</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-sm text-muted-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="h-12 rounded-lg border border-border bg-background"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <div className="text-center pt-4">
                  <Button
                    variant="link"
                    className="text-purple-600 hover:text-purple-700 text-sm p-0 h-auto"
                    onClick={() => setActiveTab('signin')}
                    type="button"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="p-6 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Reset Link Sent!</h3>
                  <p className="text-sm text-green-700">
                    We've sent a password reset link to <strong>{resetEmail}</strong>. Check your email and click the link to reset your password.
                  </p>
                </div>
                <Button
                  variant="link"
                  className="text-purple-600 text-sm p-0 h-auto"
                  onClick={() => setResetSent(false)}
                >
                  Try again
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="text-center pt-6">
          <Button variant="link" onClick={() => navigate('/')} className="text-muted-foreground text-sm p-0 h-auto">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
