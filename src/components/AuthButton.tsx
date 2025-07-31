import react from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserIcon } from 'lucide-react';

const AuthButton = () => {
  const { user, loading, signOut, isSpecialist, isClient } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Account</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            {isSpecialist ? 'Specialist Account' : isClient ? 'Client Account' : 'My Account'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            Profile
          </DropdownMenuItem>
          {isSpecialist && (
            <DropdownMenuItem onClick={() => navigate('/specialist-dashboard')}>
              Specialist Dashboard
            </DropdownMenuItem>
          )}
          {isClient && (
            <DropdownMenuItem onClick={() => navigate('/client-dashboard')}>
              My Appointments
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => navigate('/payments')}>
            Payments
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" asChild>
        <Link to="/auth">Sign In</Link>
      </Button>
      <Button asChild className="hidden sm:flex">
        <Link to="/auth?tab=signup">Sign Up</Link>
      </Button>
    </div>
  );
};

export default AuthButton;
