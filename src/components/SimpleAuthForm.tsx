
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useEnhancedCustomerAuth } from '@/hooks/useEnhancedCustomerAuth';
import { Loader2 } from 'lucide-react';

interface SimpleAuthFormProps {
  onSuccess?: () => void;
}

const SimpleAuthForm: React.FC<SimpleAuthFormProps> = ({ onSuccess }) => {
  const { signIn, signUp, loading } = useEnhancedCustomerAuth();
  
  const [loginForm, setLoginForm] = useState({
    phone: '',
    password: ''
  });

  const [signupForm, setSignupForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateSignup = () => {
    const newErrors: Record<string, string> = {};

    if (!signupForm.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!signupForm.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }

    if (!signupForm.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (signupForm.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};

    if (!loginForm.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }

    if (!loginForm.password) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateLogin()) return;

    try {
      await signIn(loginForm);
      onSuccess?.();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignup()) return;

    try {
      const { confirmPassword, ...customerData } = signupForm;
      await signUp(customerData);
      onSuccess?.();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Accès Client</CardTitle>
        <CardDescription>
          Connectez-vous ou créez votre compte client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="signup">Créer un compte</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-phone">Numéro de téléphone</Label>
                <Input
                  id="login-phone"
                  type="tel"
                  placeholder="Votre numéro de téléphone"
                  value={loginForm.phone}
                  onChange={(e) => setLoginForm({...loginForm, phone: e.target.value})}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <Label htmlFor="login-password">Mot de passe</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Se connecter
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">Nom complet *</Label>
                <Input
                  id="signup-name"
                  placeholder="Votre nom complet"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <Label htmlFor="signup-phone">Numéro de téléphone *</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="Votre numéro de téléphone"
                  value={signupForm.phone}
                  onChange={(e) => setSignupForm({...signupForm, phone: e.target.value})}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="signup-email">Email (optionnel)</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="votre@email.com"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="signup-address">Adresse (optionnel)</Label>
                <Textarea
                  id="signup-address"
                  placeholder="Votre adresse"
                  value={signupForm.address}
                  onChange={(e) => setSignupForm({...signupForm, address: e.target.value})}
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="signup-password">Mot de passe *</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Créez un mot de passe"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
              </div>
              
              <div>
                <Label htmlFor="signup-confirm-password">Confirmer le mot de passe *</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer mon compte
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SimpleAuthForm;
