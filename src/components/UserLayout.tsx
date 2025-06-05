
import React from 'react';
import { MobileNavBar } from './MobileNavBar';
import ScrollToTop from './ScrollToTop';
import { useScrollToTop } from '@/hooks/useScrollToTop';

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  useScrollToTop();
  
  return (
    <div className="min-h-screen bg-background">
      {children}
      <ScrollToTop />
      {/* MobileNavBar toujours fixe en bas */}
      <MobileNavBar />
    </div>
  );
}
