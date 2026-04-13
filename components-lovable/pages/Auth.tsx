import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  return (
    <div className="px-4 py-4">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold">
            <span className="text-gradient-hero">Welcome</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in or create an account to get started.</p>
        </div>

        <form className="space-y-4" onSubmit={e => e.preventDefault()}>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              placeholder="you@email.com"
            />
          </div>
          <Button type="submit" className="w-full">Send Magic Link</Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          We'll send you a sign-in link. No password needed.
        </p>
      </div>
    </div>
  );
};

export default Auth;
