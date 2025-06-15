
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

interface SignUpFormProps {
  onSubmit: (data: { fullName: string, email: string, password: string }) => Promise<void>;
  isSubmitting: boolean;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmit, isSubmitting }) => {
  const [signUpData, setSignUpData] = useState({ fullName: '', email: '', password: '' });
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    await onSubmit(signUpData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Création...' : 'Créer le compte'}
      </Button>
    </form>
  );
};
