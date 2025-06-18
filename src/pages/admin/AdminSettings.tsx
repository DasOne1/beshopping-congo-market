
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Store, Mail, Globe, Shield, Palette, Database } from 'lucide-react';
import { useSettings, AppSettings } from '@/hooks/useSettings';
import { toast } from '@/components/ui/use-toast';
import _ from 'lodash';

const AdminSettings = () => {
  const { settings: initialSettings, updateSetting, isLoading: isLoadingSettings } = useSettings();
  const [settings, setSettings] = useState<Partial<AppSettings>>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleFieldChange = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  const handleAddressChange = (field: 'street' | 'city' | 'country', value: string) => {
    setSettings(prev => ({
      ...prev,
      company_address: {
        ...prev.company_address,
        [field]: value,
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const changes: Promise<any>[] = [];
    
    for (const key in settings) {
      if (!_.isEqual((settings as any)[key], (initialSettings as any)[key])) {
        changes.push(updateSetting.mutateAsync({ key, value: (settings as any)[key] }));
      }
    }

    if (changes.length === 0) {
      toast({ title: 'Aucune modification', description: 'Aucun paramètre n\'a été modifié.' });
      setIsSaving(false);
      return;
    }

    try {
      await Promise.all(changes);
      toast({
        title: 'Paramètres sauvegardés',
        description: 'Vos modifications ont été enregistrées avec succès.'
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les modifications.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoadingSettings && !Object.keys(settings).length) {
    return <div>Chargement des paramètres...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Paramètres
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Configurez les paramètres de votre boutique
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="store">Boutique</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Informations générales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Nom du site</Label>
                    <Input
                      id="siteName"
                      value={settings.company_name || ''}
                      onChange={(e) => handleFieldChange('company_name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">URL du site</Label>
                    <Input
                      id="siteUrl"
                      placeholder="https://votre-site.com"
                      value={settings.site_url || ''}
                      onChange={(e) => handleFieldChange('site_url', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Description de votre boutique..."
                    value={settings.site_description || ''}
                    onChange={(e) => handleFieldChange('site_description', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Langue par défaut</Label>
                    <Select value={settings.language || 'fr'} onValueChange={(v) => handleFieldChange('language', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Fuseau horaire</Label>
                    <Select value={settings.timezone || 'Africa/Lubumbasi'} onValueChange={(v) => handleFieldChange('timezone', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Lubumbasi">Africa/Lubumbasi</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Store Settings */}
        <TabsContent value="store">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Configuration de la boutique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Devise</Label>
                    <Select 
                      value={settings.currency || 'CDF'}
                      onValueChange={(value) => handleFieldChange('currency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CDF">Franc Congolais (CDF)</SelectItem>
                        <SelectItem value="USD">Dollar US (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Taux de taxe (%)</Label>
                    <Input
                      id="taxRate"
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={(settings.tax_rate || 0) * 100}
                      onChange={(e) => handleFieldChange('tax_rate', parseFloat(e.target.value) / 100)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingFee">Frais de livraison</Label>
                    <Input
                      id="shippingFee"
                      type="number"
                      min="0"
                      value={settings.shipping_fee || 0}
                      onChange={(e) => handleFieldChange('shipping_fee', parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="freeShipping">Livraison gratuite à partir de</Label>
                    <Input
                      id="freeShipping"
                      type="number"
                      min="0"
                      value={settings.free_shipping_threshold || 0}
                      onChange={(e) => handleFieldChange('free_shipping_threshold', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <Label htmlFor="addressStreet">Rue</Label>
                    <Input
                      id="addressStreet"
                      placeholder="Av. des Cliniques"
                      value={settings.company_address?.street || ''}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                    />
                   </div>
                   <div className="space-y-2">
                    <Label htmlFor="addressCity">Ville</Label>
                    <Input
                      id="addressCity"
                      placeholder="Lubumbashi"
                      value={settings.company_address?.city || ''}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                    />
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Configuration Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">Email expéditeur</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={settings.company_email || ''}
                      onChange={(e) => handleFieldChange('company_email', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fromName">Nom expéditeur</Label>
                    <Input
                      id="fromName"
                      value={settings.company_name || ''}
                      readOnly
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="orderConfirmation" className="cursor-pointer">Confirmation de commande</Label>
                      <p className="text-sm text-gray-500">Envoyer un email de confirmation après chaque commande</p>
                    </div>
                    <Switch 
                      id="orderConfirmation" 
                      checked={!!settings.enable_order_confirmation}
                      onCheckedChange={(checked) => handleFieldChange('enable_order_confirmation', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="shipmentNotification" className="cursor-pointer">Notification d'expédition</Label>
                      <p className="text-sm text-gray-500">Informer le client quand sa commande est expédiée</p>
                    </div>
                    <Switch 
                      id="shipmentNotification" 
                      checked={!!settings.enable_shipment_notification}
                      onCheckedChange={(checked) => handleFieldChange('enable_shipment_notification', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newsletter" className="cursor-pointer">Newsletter</Label>
                      <p className="text-sm text-gray-500">Permettre l'inscription à la newsletter</p>
                    </div>
                    <Switch 
                      id="newsletter" 
                      checked={!!settings.enable_newsletter}
                      onCheckedChange={(checked) => handleFieldChange('enable_newsletter', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactor" className="cursor-pointer">Authentification à deux facteurs</Label>
                      <p className="text-sm text-gray-500">Sécuriser l'accès administrateur avec 2FA</p>
                    </div>
                    <Switch 
                      id="twoFactor" 
                      checked={!!settings.enable_2fa}
                      onCheckedChange={(checked) => handleFieldChange('enable_2fa', checked)}
                      disabled
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="loginLogging" className="cursor-pointer">Journal des connexions</Label>
                      <p className="text-sm text-gray-500">Enregistrer toutes les tentatives de connexion</p>
                    </div>
                    <Switch 
                      id="loginLogging" 
                      checked={!!settings.enable_login_logging}
                      onCheckedChange={(checked) => handleFieldChange('enable_login_logging', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoLogout" className="cursor-pointer">Déconnexion automatique</Label>
                      <p className="text-sm text-gray-500">Déconnecter après 30 minutes d'inactivité</p>
                    </div>
                    <Switch 
                      id="autoLogout" 
                      checked={!!settings.enable_auto_logout}
                      onCheckedChange={(checked) => handleFieldChange('enable_auto_logout', checked)}
                    />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Sauvegarde des données</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dernière sauvegarde</span>
                      <span className="text-sm text-gray-500">Il y a 2 heures</span>
                    </div>
                    <Button variant="outline" className="w-full" disabled>
                      <Database className="h-4 w-4 mr-2" />
                      Créer une sauvegarde maintenant
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Apparence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Thème</Label>
                  <Select value={settings.theme || 'light'} onValueChange={(v) => handleFieldChange('theme', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="auto">Automatique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Couleur principale</Label>
                  <div className="flex items-center gap-2">
                    <Input type="color" value={settings.primary_color || '#3b82f6'} onChange={(e) => handleFieldChange('primary_color', e.target.value)} className="w-16 h-10 p-1" />
                    <Input value={settings.primary_color || '#3b82f6'} onChange={(e) => handleFieldChange('primary_color', e.target.value)} className="flex-1" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <Input type="file" accept="image/*" disabled />
                  <p className="text-sm text-gray-500">Fonctionnalité d'upload bientôt disponible.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon</Label>
                  <Input type="file" accept="image/*" disabled />
                  <p className="text-sm text-gray-500">Fonctionnalité d'upload bientôt disponible.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end sticky bottom-0 bg-white dark:bg-gray-900 py-4 px-6 border-t">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
