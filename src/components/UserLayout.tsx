
import React from 'react';
import { MobileNavBar } from './MobileNavBar';

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
      <MobileNavBar />
    </div>
  );
}
