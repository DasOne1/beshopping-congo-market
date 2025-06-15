
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { toast } from '@/components/ui/use-toast';
import { SignInForm } from '@/components/admin/SignInForm';
import { SignUpForm } from '@/components/admin/SignUpForm';

const AdminAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isAuthenticated, loading: authLoading } = useAdminAuth();
  const { adminUsers, isLoading: isLoadingUsers, createAdminUser, isCreating: isCreatingUser } = useAdminUsers();
  
  const from = location.state?.from || '/admin/dashboard';

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate, from]);

  const handleLogin = async (loginData: {email: string, password: string}) => {
    try {
      await signIn(loginData.email, loginData.password);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSignUp = async (signUpData: {fullName: string, email: string, password: string}) => {
    createAdminUser({ ...signUpData, role: 'admin' }, {
        onSuccess: () => {
            toast({
              title: "Compte administrateur créé",
              description: "Vous pouvez maintenant vous connecter avec vos identifiants.",
            });
        },
    });
  };

  const globalLoading = authLoading || isLoadingUsers;
  const needsSetup = !globalLoading && adminUsers && adminUsers.length === 0;

  if (globalLoading && !isCreatingUser) {
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
              {needsSetup ? "Créez le premier compte administrateur" : "Veuillez vous connecter pour continuer"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {needsSetup ? (
              <SignUpForm onSubmit={handleSignUp} isSubmitting={isCreatingUser} />
            ) : (
              <SignInForm onSubmit={handleLogin} isSubmitting={authLoading} />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminAuth;
