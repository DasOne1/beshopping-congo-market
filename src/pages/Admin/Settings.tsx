
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings as SettingsIcon, Building, CreditCard, Bell, Shield, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface AppSettings {
  company_name: string;
  company_email: string;
  company_phone: string;
  company_address: string;
  currency: string;
  tax_rate: number;
  shipping_fee: number;
  free_shipping_threshold: number;
  whatsapp_support: string;
  whatsapp_sales: string;
}

export default function Settings() {
  const { isAuthenticated, adminUser } = useAuth();
  const [settings, setSettings] = useState<AppSettings>({
    company_name: 'BeShop Congo',
    company_email: 'contact@beshop.cd',
    company_phone: '+243978100940',
    company_address: 'Kinshasa, République Démocratique du Congo',
    currency: 'CDF',
    tax_rate: 0.16,
    shipping_fee: 5000,
    free_shipping_threshold: 50000,
    whatsapp_support: '+243978100940',
    whatsapp_sales: '+243974984449',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </AdminLayout>
    );
  }

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('key, value');

      if (error) throw error;

      if (data) {
        const settingsObj = data.reduce((acc, setting) => {
          acc[setting.key] = typeof setting.value === 'string' 
            ? JSON.parse(setting.value) 
            : setting.value;
          return acc;
        }, {} as any);

        setSettings(prev => ({ ...prev, ...settingsObj }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paramètres",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value: JSON.stringify(value),
      }));

      for (const setting of settingsArray) {
        const { error } = await supabase
          .from('app_settings')
          .upsert(
            { 
              key: setting.key, 
              value: setting.value,
              updated_at: new Date().toISOString()
            },
            { onConflict: 'key' }
          );

        if (error) throw error;
      }

      toast({
        title: "Paramètres sauvegardés",
        description: "Les paramètres ont été mis à jour avec succès",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les paramètres",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (key: keyof AppSettings, value: string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Chargement des paramètres...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <SettingsIcon className="mr-2 h-6 w-6" />
              Paramètres
            </h1>
            <p className="text-muted-foreground">Configurer les paramètres de l'application</p>
          </div>
          
          <Button onClick={saveSettings} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>

        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="company">Entreprise</TabsTrigger>
            <TabsTrigger value="commerce">Commerce</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Informations de l'entreprise
                </CardTitle>
                <CardDescription>
                  Configurer les informations de base de votre entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Nom de l'entreprise</Label>
                    <Input
                      id="company_name"
                      value={settings.company_name}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      placeholder="Nom de l'entreprise"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_email">Email de contact</Label>
                    <Input
                      id="company_email"
                      type="email"
                      value={settings.company_email}
                      onChange={(e) => handleInputChange('company_email', e.target.value)}
                      placeholder="contact@entreprise.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_phone">Téléphone</Label>
                    <Input
                      id="company_phone"
                      value={settings.company_phone}
                      onChange={(e) => handleInputChange('company_phone', e.target.value)}
                      placeholder="+243..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Devise</Label>
                    <Input
                      id="currency"
                      value={settings.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      placeholder="CDF"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company_address">Adresse complète</Label>
                  <Textarea
                    id="company_address"
                    value={settings.company_address}
                    onChange={(e) => handleInputChange('company_address', e.target.value)}
                    placeholder="Adresse complète de l'entreprise"
                    className="min-h-20"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commerce">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Paramètres commerciaux
                </CardTitle>
                <CardDescription>
                  Configurer les prix, taxes et frais de livraison
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tax_rate">Taux de taxe (%)</Label>
                    <Input
                      id="tax_rate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={settings.tax_rate}
                      onChange={(e) => handleInputChange('tax_rate', parseFloat(e.target.value))}
                      placeholder="0.16"
                    />
                    <p className="text-xs text-muted-foreground">
                      Entrez le taux en décimal (ex: 0.16 pour 16%)
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="shipping_fee">Frais de livraison (CDF)</Label>
                    <Input
                      id="shipping_fee"
                      type="number"
                      min="0"
                      value={settings.shipping_fee}
                      onChange={(e) => handleInputChange('shipping_fee', parseInt(e.target.value))}
                      placeholder="5000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="free_shipping_threshold">Seuil livraison gratuite (CDF)</Label>
                    <Input
                      id="free_shipping_threshold"
                      type="number"
                      min="0"
                      value={settings.free_shipping_threshold}
                      onChange={(e) => handleInputChange('free_shipping_threshold', parseInt(e.target.value))}
                      placeholder="50000"
                    />
                    <p className="text-xs text-muted-foreground">
                      Montant minimum pour bénéficier de la livraison gratuite
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_support">WhatsApp Support</Label>
                    <Input
                      id="whatsapp_support"
                      value={settings.whatsapp_support}
                      onChange={(e) => handleInputChange('whatsapp_support', e.target.value)}
                      placeholder="+243..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_sales">WhatsApp Ventes</Label>
                    <Input
                      id="whatsapp_sales"
                      value={settings.whatsapp_sales}
                      onChange={(e) => handleInputChange('whatsapp_sales', e.target.value)}
                      placeholder="+243..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Gérer les notifications et alertes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications de nouvelles commandes</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir une notification pour chaque nouvelle commande
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertes de stock faible</Label>
                    <p className="text-sm text-muted-foreground">
                      Être alerté quand le stock d'un produit est faible
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rapport quotidien des ventes</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevoir un résumé quotidien des ventes
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Sécurité
                </CardTitle>
                <CardDescription>
                  Paramètres de sécurité et accès
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Profil utilisateur</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Informations du compte connecté
                    </p>
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div><strong>Email:</strong> {adminUser?.email}</div>
                      <div><strong>Rôle:</strong> {adminUser?.role}</div>
                      <div><strong>Nom:</strong> {adminUser?.full_name || 'Non défini'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Authentification à deux facteurs</Label>
                      <p className="text-sm text-muted-foreground">
                        Ajouter une couche de sécurité supplémentaire
                      </p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Sessions multiples</Label>
                      <p className="text-sm text-muted-foreground">
                        Autoriser plusieurs connexions simultanées
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
