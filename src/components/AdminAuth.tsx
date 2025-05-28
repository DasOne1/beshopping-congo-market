
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Logo } from './Logo';
import { useAuth } from '@/hooks/useAuth';

interface AdminAuthProps {
  children: React.ReactNode;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ children }) => {
  const { user, isLoading, signIn } = useAuth();
  const [email, setEmail] = useState('admin@beshop.com');
  const [password, setPassword] = useState('admin123');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) return;
    
    setIsSigningIn(true);
    try {
      await signIn.mutateAsync({ email, password });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4 flex flex-col items-center">
            <Logo size="medium" />
            <CardTitle className="text-2xl text-center">Connexion Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@beshop.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSigningIn || !email || !password}
              >
                {isSigningIn ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            <div className="w-full space-y-2">
              <p>Identifiants par défaut:</p>
              <p><strong>Email:</strong> admin@beshop.com</p>
              <p><strong>Mot de passe:</strong> admin123</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminAuth;
