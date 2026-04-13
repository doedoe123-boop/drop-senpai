import { ReactNode } from 'react';
import BottomNav from './BottomNav';
import Header from './Header';

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-lg pb-20">{children}</main>
      <BottomNav />
    </div>
  );
};

export default AppShell;
