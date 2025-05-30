import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AdminDesktopNavigation } from './AdminDesktopNavigation';
import { Link } from 'react-router-dom';

export function AdminHeader() {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center space-x-8">
          {/* Logo et titre */}
          <div className="flex items-center space-x-3">
            <Link to="/admin">
              <img src="/favicon.svg" alt="BeShopping Logo" className="h-10 w-10" />
            </Link>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Administration</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tableau de bord</p>
            </div>
          </div>
          
          {/* Navigation Desktop */}
          <AdminDesktopNavigation />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex"
          >
            <Bell className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/settings')}
            className="hidden sm:flex"
          >
            <Settings className="h-4 w-4" />
          </Button>
          
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
