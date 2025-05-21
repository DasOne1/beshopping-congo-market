
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/Logo';

interface AdminAuthProps {
  children: React.ReactNode;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuthenticated') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple admin authentication - in a real app, this would be server-side
    // Using a timeout to simulate an API call
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminAuthenticated', 'true');
        setIsAuthenticated(true);
        toast({
          title: "Success",
          description: "You are now logged in as admin",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Authentication failed",
          description: "Invalid username or password",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin area",
    });
  };

  if (isAuthenticated) {
    return (
      <>
        <div className="p-2 bg-muted text-center text-sm">
          Admin mode active - 
          <Button variant="link" size="sm" onClick={handleLogout} className="text-destructive">
            Logout
          </Button>
        </div>
        {children}
      </>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1 flex items-center flex-col">
          <Logo size="medium" className="mb-2" />
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin area
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text" 
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
        <div className="p-4 text-center text-sm text-muted-foreground">
          <p>Demo credentials - Username: admin | Password: admin123</p>
        </div>
      </Card>
    </div>
  );
};

export default AdminAuth;
