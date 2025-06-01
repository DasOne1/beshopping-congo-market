
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmailVerificationDialogProps {
  isOpen: boolean;
  email: string;
  loading: boolean;
  onVerify: (code: string) => void;
  onClose: () => void;
}

const EmailVerificationDialog = ({ 
  isOpen, 
  email, 
  loading, 
  onVerify, 
  onClose 
}: EmailVerificationDialogProps) => {
  const [verificationCode, setVerificationCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim()) {
      onVerify(verificationCode);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full"
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-2">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Vérification d'email</CardTitle>
                <CardDescription>
                  Nous avons envoyé un code à {email}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="verification-code">Code de vérification</Label>
                <Input
                  id="verification-code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Entrez le code reçu par email"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Le code est valide pendant 24 heures
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" disabled={loading || !verificationCode.trim()} className="flex-1">
                  {loading ? (
                    'Vérification...'
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Vérifier
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  Annuler
                </Button>
              </div>
            </form>
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                💡 <strong>Astuce :</strong> Pour cette démo, vous pouvez utiliser n'importe quel code pour vérifier votre email.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmailVerificationDialog;
