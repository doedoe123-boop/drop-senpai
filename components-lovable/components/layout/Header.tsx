import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'EventDrops PH',
  '/explore': 'Explore',
  '/submit': 'Submit',
  '/saved': 'Saved',
  '/profile': 'Profile',
  '/auth': 'Sign In',
  '/admin': 'Admin',
};

const Header = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/item/')) return null;

  const title = pageTitles[location.pathname] || 'EventDrops PH';
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        {isHome ? (
          <h1 className="font-heading text-lg font-bold tracking-tight">
            <span className="text-gradient-hero">Event</span>
            <span className="text-foreground">Drops</span>
            <span className="ml-1 text-xs font-medium text-muted-foreground">PH</span>
          </h1>
        ) : (
          <h1 className="font-heading text-lg font-semibold">{title}</h1>
        )}
      </div>
    </header>
  );
};

export default Header;
