
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, User, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { toast } from '@/components/ui/use-toast';

const AdminAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isAuthenticated, loading: authLoading } = useAdminAuth();
  const { createAdminUser, isCreating: isCreatingUser } = useAdminUsers();
  
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ fullName: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  const from = location.state?.from || '/admin/dashboard';

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await signIn(loginData.email, loginData.password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreatingUser) return;
    
    createAdminUser({ ...signUpData, role: 'admin' }, {
        onSuccess: () => {
            toast({
              title: "Compte administrateur créé",
              description: "Vous pouvez maintenant vous connecter avec vos identifiants.",
            });
            setSignUpData({ fullName: '', email: '', password: '' });
            setActiveTab('signin');
        },
    });
  };

  const loading = authLoading || isSubmitting;

  if (authLoading && !isCreatingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80">
          <CardHeader className="text-center space-y-2 pb-4">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Administration BeShopping
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Veuillez vous connecter pour continuer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Se connecter</TabsTrigger>
                <TabsTrigger value="signup">Créer le premier admin</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="pt-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email administrateur</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="admin@beshopping.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="bg-white dark:bg-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        required
                        className="bg-white dark:bg-gray-700 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Connexion...
                      </div>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup" className="pt-4">
                 <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-fullname">Nom complet</Label>
                      <Input id="signup-fullname" placeholder="Jean Dupont" value={signUpData.fullName} onChange={(e) => setSignUpData(p => ({...p, fullName: e.target.value}))} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" type="email" placeholder="admin@exemple.com" value={signUpData.email} onChange={(e) => setSignUpData(p => ({...p, email: e.target.value}))} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Mot de passe</Label>
                      <div className="relative">
                        <Input id="signup-password" type={showSignUpPassword ? "text" : "password"} placeholder="••••••••" value={signUpData.password} onChange={(e) => setSignUpData(p => ({...p, password: e.target.value}))} required />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        >
                          {showSignUpPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isCreatingUser}>
                      {isCreatingUser ? 'Création...' : 'Créer le compte'}
                    </Button>
                 </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminAuth;

