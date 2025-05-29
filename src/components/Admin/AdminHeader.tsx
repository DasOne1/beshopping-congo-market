
import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function AdminHeader() {
  return (
    <div className="flex justify-between items-center p-4 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div>
        <h1 className="text-xl font-semibold">Administration</h1>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default AdminHeader;
