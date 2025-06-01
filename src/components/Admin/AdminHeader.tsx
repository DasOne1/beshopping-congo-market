
import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bell, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { AdminDesktopNavigation } from './AdminDesktopNavigation';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useIsMobile } from '@/hooks/use-mobile';

export function AdminHeader() {
  const navigate = useNavigate();
  const { signOut, adminProfile } = useAdminAuth();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await signOut();
    navigate('/dasgabriel@adminaccess');
  };

  return (
    <div className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6 max-w-full">
        <div className="flex items-center space-x-8 min-w-0">
          {/* Logo et titre */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Link to="/dasgabriel@adminaccess/dashboard">
              <img src="/shopping_logo.png" alt="BeShopping Logo" className="h-10 w-10" />
            </Link>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Administration</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {adminProfile?.full_name || 'Administrateur'}
              </p>
            </div>
          </div>
          
          {/* Navigation Desktop */}
          <div className="hidden md:block flex-1 min-w-0">
            <AdminDesktopNavigation />
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          {/* Notifications - toujours visible */}
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center"
          >
            <Bell className="h-4 w-4" />
          </Button>
          
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Menu Profil - dernière position */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                {!isMobile && <span className="text-sm">Profil</span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-2">
                <p className="text-sm font-medium">{adminProfile?.full_name || 'Administrateur'}</p>
                <p className="text-xs text-gray-500 truncate">{adminProfile?.email}</p>
              </div>
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => navigate('/dasgabriel@adminaccess/accounts')}>
                <User className="mr-2 h-4 w-4" />
                <span>Comptes</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/dasgabriel@adminaccess/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
