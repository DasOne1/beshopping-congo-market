import React from 'react';
import { Settings, Moon, Sun, Bell, User, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const downloadDemoReport = () => {
  // Simulate report download; in prod, fetch from api and download blob as pdf
  const blob = new Blob(
    ['Rapport téléchargé à ' + new Date().toLocaleString()],
    { type: "text/plain" }
  );
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "rapport_Admin_BeShopping.txt";
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Rapport téléchargé avec succès !");
};

const AdminHeader = () => {
  const { adminProfile, signOut } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/auth');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-[8px]">
      <div className="flex items-center justify-between px-4 md:px-8 h-16 max-w-full">
        <div className="flex gap-2 items-center min-w-0 flex-1">
          <Logo size="small" className="mr-2" asLink={true} />
          <h1 className="text-lg md:text-2xl font-extrabold text-gradient tracking-tight hidden sm:block truncate">
            BeShopping <span className="text-xs text-gray-500 dark:text-gray-400 font-normal ml-1">Admin</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadDemoReport}
            className="flex items-center gap-2 font-semibold text-primary border-primary-foreground hover:bg-primary/10 transition-all"
            title="Télécharger le rapport"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Rapport</span>
          </Button>
          {/* Toggle thème */}
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 text-[10px] p-0 flex items-center justify-center">
              3
            </Badge>
          </Button>
          {/* Paramètres */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/admin/settings')}
            className="hidden sm:flex"
          >
            <Settings className="h-4 w-4" />
          </Button>
          {/* Menu profil */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-1 md:gap-2 min-w-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium truncate max-w-[100px]">
                  {adminProfile?.full_name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium truncate">{adminProfile?.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">{adminProfile?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                <User className="mr-2 h-4 w-4" />
                Mon profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/')}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Aller à la boutique
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
