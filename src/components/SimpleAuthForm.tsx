
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Phone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

const SimpleAuthForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  
  const { signIn: login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    try {
      await login('', '', formData.name);
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté !",
      });
    } catch (error) {
      console.error('Erreur de connexion:', error);
      toast({
        title: "Erreur de connexion",
        description: "Impossible de vous connecter. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          Mes informations
        </CardTitle>
        <CardDescription>
          Renseignez vos informations pour passer commande
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom complet *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Votre nom complet"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Numéro de téléphone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="Votre numéro de téléphone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Adresse de livraison</Label>
            <Textarea
              id="address"
              placeholder="Votre adresse de livraison"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Continuer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SimpleAuthForm;
