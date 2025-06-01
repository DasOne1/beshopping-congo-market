
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Phone, Lock, Eye, EyeOff, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

const AuthDialog = ({ isOpen, onClose, defaultMode = 'login' }: AuthDialogProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const resetForm = () => {
    setPhone('');
    setEmail('');
    setPassword('');
    setFullName('');
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (!fullName.trim()) {
          toast({
            title: "Erreur",
            description: "Le nom complet est requis",
            variant: "destructive",
          });
          return;
        }
        if (!phone.trim()) {
          toast({
            title: "Erreur",
            description: "Le numéro de téléphone est requis",
            variant: "destructive",
          });
          return;
        }
        await signUp(phone, password, fullName, email || undefined);
        toast({
          title: "Compte créé avec succès",
          description: "Vous pouvez maintenant vous connecter",
        });
        setMode('login');
        setPassword('');
      } else {
        if (!phone.trim()) {
          toast({
            title: "Erreur",
            description: "Le numéro de téléphone est requis",
            variant: "destructive",
          });
          return;
        }
        await signIn(phone, password);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue !",
        });
        handleClose();
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">
                    {mode === 'login' ? 'Connexion' : 'Créer un compte'}
                  </CardTitle>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <CardDescription>
                {mode === 'login' 
                  ? 'Connectez-vous avec votre numéro de téléphone'
                  : 'Créez votre compte pour personnaliser votre profil'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Votre nom complet"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Numéro de téléphone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+243 XXX XXX XXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {mode === 'signup' && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (facultatif)</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>
                        {mode === 'login' ? 'Connexion...' : 'Création...'}
                      </span>
                    </div>
                  ) : (
                    mode === 'login' ? 'Se connecter' : 'Créer le compte'
                  )}
                </Button>
              </form>
              
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {mode === 'login' ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
                  <Button
                    variant="link"
                    onClick={() => {
                      setMode(mode === 'login' ? 'signup' : 'login');
                      setPassword('');
                    }}
                    className="ml-1 p-0 h-auto font-medium"
                  >
                    {mode === 'login' ? 'Créer un compte' : 'Se connecter'}
                  </Button>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthDialog;
