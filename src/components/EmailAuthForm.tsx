
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Phone, Mail, MapPin, Lock, Eye, EyeOff } from 'lucide-react';
import { useEmailAuth } from '@/hooks/useEmailAuth';
import { useNavigate } from 'react-router-dom';

interface EmailAuthFormProps {
  onSuccess?: () => void;
}

const EmailAuthForm = ({ onSuccess }: EmailAuthFormProps) => {
  const navigate = useNavigate();
  const [signUpForm, setSignUpForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    password: ''
  });

  const [signInForm, setSignInForm] = useState({
    email: '',
    password: ''
  });
  
  const { signUp, signIn, loading, isAuthenticated, currentCustomer } = useEmailAuth();
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Réinitialiser les formulaires et rediriger après une connexion réussie
  useEffect(() => {
    if (isAuthenticated && currentCustomer) {
      setSignInForm({ email: '', password: '' });
      setSignUpForm({
        name: '',
        phone: '',
        email: '',
        address: '',
        password: ''
      });
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, currentCustomer, onSuccess, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signUpForm.email || !signUpForm.password || !signUpForm.name) {
      return;
    }

    if (signUpForm.password.length < 6) {
      return;
    }

    try {
      await signUp(signUpForm);
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signInForm.email || !signInForm.password) {
      return;
    }

    try {
      await signIn(signInForm.email, signInForm.password);
    } catch (error) {
      // Error handled in hook
    }
  };

  // Si l'utilisateur est authentifié, ne pas afficher le formulaire
  if (isAuthenticated && currentCustomer) {
    return null;
  }

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Mon Compte
        </CardTitle>
        <CardDescription>
          Créez un compte ou connectez-vous avec votre email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Se connecter</TabsTrigger>
            <TabsTrigger value="signup">Créer un compte</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="signin-email">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={signInForm.email}
                    onChange={(e) => setSignInForm({...signInForm, email: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="signin-password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signin-password"
                    type={showSignInPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    value={signInForm.password}
                    onChange={(e) => setSignInForm({...signInForm, password: e.target.value})}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showSignInPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">Nom complet *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Votre nom complet"
                    value={signUpForm.name}
                    onChange={(e) => setSignUpForm({...signUpForm, name: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-email">Adresse email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({...signUpForm, email: e.target.value})}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="signup-phone">Numéro de téléphone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="Votre numéro de téléphone"
                    value={signUpForm.phone}
                    onChange={(e) => setSignUpForm({...signUpForm, phone: e.target.value})}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="signup-address">Adresse de livraison</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="signup-address"
                    placeholder="Votre adresse de livraison"
                    value={signUpForm.address}
                    onChange={(e) => setSignUpForm({...signUpForm, address: e.target.value})}
                    className="pl-10 pt-3"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="signup-password">Mot de passe *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type={showSignUpPassword ? "text" : "password"}
                    placeholder="Minimum 6 caractères"
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm({...signUpForm, password: e.target.value})}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Le mot de passe doit contenir au moins 6 caractères
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Création...' : 'Créer mon compte'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmailAuthForm;
