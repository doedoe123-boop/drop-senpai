import { User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="rounded-full bg-secondary p-4 mb-4">
        <User className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="font-heading text-lg font-semibold">Not signed in</h2>
      <p className="mt-1 text-sm text-muted-foreground max-w-xs">
        Sign in to submit events, save items, and manage your profile.
      </p>
      <Button className="mt-5 gap-2" onClick={() => navigate('/auth')}>
        <LogIn className="h-4 w-4" />
        Sign In
      </Button>
    </div>
  );
};

export default Profile;
