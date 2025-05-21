
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';

interface AdminAuthProps {
  children: React.ReactNode;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('admin-auth') === 'true'
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple admin authentication - in a real app, this would be on the server
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('admin-auth', 'true');
      setIsAuthenticated(true);
      toast({
        title: 'Login successful',
        description: 'Welcome to admin dashboard',
      });
    } else {
      toast({
        title: 'Login failed',
        description: 'Invalid username or password',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-auth');
    setIsAuthenticated(false);
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
            <p className="w-full">Default credentials: admin / admin123</p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Add logout button to admin layout
  React.useEffect(() => {
    const adminHeader = document.querySelector('.admin-header-logout');
    if (adminHeader && !adminHeader.querySelector('.admin-logout-btn')) {
      const logoutBtn = document.createElement('button');
      logoutBtn.className = 'admin-logout-btn ml-auto px-3 py-1 text-sm bg-destructive text-destructive-foreground rounded';
      logoutBtn.textContent = 'Logout';
      logoutBtn.addEventListener('click', handleLogout);
      adminHeader.appendChild(logoutBtn);
    }
  }, []);

  return <>{children}</>;
};

export default AdminAuth;
