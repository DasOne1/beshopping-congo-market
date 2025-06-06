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
import { toast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface EmailAuthFormProps {
  onSuccess?: () => void;
}

interface AuthError {
  message: string;
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      setErrors({});
      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, currentCustomer, onSuccess, navigate]);

  const validateSignUpForm = () => {
    const newErrors: Record<string, string> = {};

    if (!signUpForm.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!signUpForm.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpForm.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!signUpForm.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (signUpForm.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignInForm = () => {
    const newErrors: Record<string, string> = {};

    if (!signInForm.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInForm.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!signInForm.password) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignUpForm()) {
      return;
    }

    try {
      await signUp(signUpForm);
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Erreur d'inscription",
        description: authError.message || "Une erreur est survenue lors de la création du compte",
        variant: "destructive",
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSignInForm()) {
      return;
    }

    try {
      await signIn(signInForm.email, signInForm.password);
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Erreur de connexion",
        description: authError.message || "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
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
                    onChange={(e) => {
                      setSignInForm({...signInForm, email: e.target.value});
                      if (errors.email) {
                        setErrors({...errors, email: ''});
                      }
                    }}
                    className={cn("pl-10", errors.email && "border-red-500")}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
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
                    onChange={(e) => {
                      setSignInForm({...signInForm, password: e.target.value});
                      if (errors.password) {
                        setErrors({...errors, password: ''});
                      }
                    }}
                    className={cn("pl-10 pr-10", errors.password && "border-red-500")}
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
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
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
                    onChange={(e) => {
                      setSignUpForm({...signUpForm, name: e.target.value});
                      if (errors.name) {
                        setErrors({...errors, name: ''});
                      }
                    }}
                    className={cn("pl-10", errors.name && "border-red-500")}
                    required
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
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
                    onChange={(e) => {
                      setSignUpForm({...signUpForm, email: e.target.value});
                      if (errors.email) {
                        setErrors({...errors, email: ''});
                      }
                    }}
                    className={cn("pl-10", errors.email && "border-red-500")}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
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
                <Label htmlFor="signup-address">Adresse</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="signup-address"
                    placeholder="Votre adresse"
                    value={signUpForm.address}
                    onChange={(e) => setSignUpForm({...signUpForm, address: e.target.value})}
                    className="pl-10"
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
                    placeholder="Votre mot de passe"
                    value={signUpForm.password}
                    onChange={(e) => {
                      setSignUpForm({...signUpForm, password: e.target.value});
                      if (errors.password) {
                        setErrors({...errors, password: ''});
                      }
                    }}
                    className={cn("pl-10 pr-10", errors.password && "border-red-500")}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showSignUpPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Création du compte...' : 'Créer un compte'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmailAuthForm;
