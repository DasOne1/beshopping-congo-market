
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Store, Mail, Globe, Shield, Bell, Palette, Database } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { toast } from '@/components/ui/use-toast';

const AdminSettings = () => {
  const { settings, updateSetting } = useSettings();
  const [loading, setLoading] = useState(false);

  const handleSettingUpdate = async (key: string, value: any) => {
    setLoading(true);
    try {
      await updateSetting.mutateAsync({ key, value });
    } catch (error) {
      console.error('Error updating setting:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <TabsList className="grid w-full grid-cols-5">
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Nom du site</Label>
                    <Input
                      id="siteName"
                      defaultValue={settings.company_name}
                      onBlur={(e) => handleSettingUpdate('company_name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">URL du site</Label>
                    <Input
                      id="siteUrl"
                      placeholder="https://votre-site.com"
                      defaultValue="https://beshopping.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Description de votre boutique..."
                    defaultValue="Votre boutique en ligne de confiance"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Langue par défaut</Label>
                    <Select defaultValue="fr">
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
                    <Select defaultValue="Africa/Kinshasa">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Kinshasa">Africa/Kinshasa</SelectItem>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Devise</Label>
                    <Select 
                      defaultValue={settings.currency}
                      onValueChange={(value) => handleSettingUpdate('currency', value)}
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
                      defaultValue={settings.tax_rate * 100}
                      onBlur={(e) => handleSettingUpdate('tax_rate', parseFloat(e.target.value) / 100)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingFee">Frais de livraison</Label>
                    <Input
                      id="shippingFee"
                      type="number"
                      min="0"
                      defaultValue={settings.shipping_fee}
                      onBlur={(e) => handleSettingUpdate('shipping_fee', parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="freeShipping">Livraison gratuite à partir de</Label>
                    <Input
                      id="freeShipping"
                      type="number"
                      min="0"
                      defaultValue={settings.free_shipping_threshold}
                      onBlur={(e) => handleSettingUpdate('free_shipping_threshold', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse de la boutique</Label>
                  <Textarea
                    id="address"
                    placeholder="Adresse complète de votre boutique..."
                    defaultValue={`${settings.company_address?.street || ''}, ${settings.company_address?.city || ''}`}
                  />
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromEmail">Email expéditeur</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      defaultValue={settings.company_email}
                      onBlur={(e) => handleSettingUpdate('company_email', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fromName">Nom expéditeur</Label>
                    <Input
                      id="fromName"
                      defaultValue={settings.company_name}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="orderConfirmation">Confirmation de commande</Label>
                      <p className="text-sm text-gray-500">Envoyer un email de confirmation après chaque commande</p>
                    </div>
                    <Switch id="orderConfirmation" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="shipmentNotification">Notification d'expédition</Label>
                      <p className="text-sm text-gray-500">Informer le client quand sa commande est expédiée</p>
                    </div>
                    <Switch id="shipmentNotification" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newsletter">Newsletter</Label>
                      <p className="text-sm text-gray-500">Permettre l'inscription à la newsletter</p>
                    </div>
                    <Switch id="newsletter" />
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
                      <Label htmlFor="twoFactor">Authentification à deux facteurs</Label>
                      <p className="text-sm text-gray-500">Sécuriser l'accès administrateur avec 2FA</p>
                    </div>
                    <Switch id="twoFactor" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="loginLogging">Journal des connexions</Label>
                      <p className="text-sm text-gray-500">Enregistrer toutes les tentatives de connexion</p>
                    </div>
                    <Switch id="loginLogging" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoLogout">Déconnexion automatique</Label>
                      <p className="text-sm text-gray-500">Déconnecter après 30 minutes d'inactivité</p>
                    </div>
                    <Switch id="autoLogout" defaultChecked />
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Sauvegarde des données</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dernière sauvegarde</span>
                      <span className="text-sm text-gray-500">Il y a 2 heures</span>
                    </div>
                    <Button variant="outline" className="w-full">
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
                  <Select defaultValue="light">
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
                  <div className="flex gap-2">
                    <Input type="color" defaultValue="#3b82f6" className="w-20" />
                    <Input defaultValue="#3b82f6" className="flex-1" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logo">Logo</Label>
                  <Input type="file" accept="image/*" />
                  <p className="text-sm text-gray-500">Formats acceptés: PNG, JPG, SVG (max 2MB)</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="favicon">Favicon</Label>
                  <Input type="file" accept="image/*" />
                  <p className="text-sm text-gray-500">Format recommandé: ICO ou PNG 32x32px</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button disabled={loading}>
          {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
