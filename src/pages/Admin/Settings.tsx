
import React, { useState } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Save, Building, Mail, Smartphone, CreditCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSettings } from '@/hooks/useAppSettings';

export default function SettingsPage() {
  const { user } = useAuth();
  const { settings, isLoading, updateSettings } = useAppSettings();
  const [formData, setFormData] = useState(settings || {});

  React.useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Chargement des paramètres...</p>
        </div>
      </AdminLayout>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    updateSettings.mutate(formData);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Settings className="mr-2 h-6 w-6" />
              Paramètres
            </h1>
            <p className="text-muted-foreground">Gérer les paramètres de votre application</p>
          </div>
          
          <Button onClick={handleSave} disabled={updateSettings.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateSettings.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>

        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="company">Entreprise</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="shipping">Livraison</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Informations de l'entreprise
                </CardTitle>
                <CardDescription>
                  Gérez les informations de base de votre entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name">Nom de l'entreprise</Label>
                    <Input
                      id="company_name"
                      value={formData?.company_name || ''}
                      onChange={(e) => handleInputChange('company_name', e.target.value)}
                      placeholder="BeShop"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_email">Email</Label>
                    <Input
                      id="company_email"
                      type="email"
                      value={formData?.company_email || ''}
                      onChange={(e) => handleInputChange('company_email', e.target.value)}
                      placeholder="contact@beshop.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_phone">Téléphone</Label>
                    <Input
                      id="company_phone"
                      value={formData?.company_phone || ''}
                      onChange={(e) => handleInputChange('company_phone', e.target.value)}
                      placeholder="+243 978 100 940"
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency">Devise</Label>
                    <Input
                      id="currency"
                      value={formData?.currency || 'CDF'}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      placeholder="CDF"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="company_description">Description</Label>
                  <Textarea
                    id="company_description"
                    value={formData?.company_description || ''}
                    onChange={(e) => handleInputChange('company_description', e.target.value)}
                    placeholder="Description de votre entreprise..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="company_address">Adresse</Label>
                  <Textarea
                    id="company_address"
                    value={formData?.company_address || ''}
                    onChange={(e) => handleInputChange('company_address', e.target.value)}
                    placeholder="Adresse complète de votre entreprise..."
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="company_logo">Logo (URL)</Label>
                  <Input
                    id="company_logo"
                    value={formData?.company_logo || ''}
                    onChange={(e) => handleInputChange('company_logo', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="mr-2 h-5 w-5" />
                  WhatsApp
                </CardTitle>
                <CardDescription>
                  Configuration du contact WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable_whatsapp"
                    checked={formData?.enable_whatsapp || false}
                    onCheckedChange={(checked) => handleInputChange('enable_whatsapp', checked)}
                  />
                  <Label htmlFor="enable_whatsapp">Activer WhatsApp</Label>
                </div>
                
                <div>
                  <Label htmlFor="whatsapp_number">Numéro WhatsApp</Label>
                  <Input
                    id="whatsapp_number"
                    value={formData?.whatsapp_number || ''}
                    onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                    placeholder="243978100940"
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5" />
                  Email
                </CardTitle>
                <CardDescription>
                  Configuration des notifications email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enable_email_notifications"
                    checked={formData?.enable_email_notifications || false}
                    onCheckedChange={(checked) => handleInputChange('enable_email_notifications', checked)}
                  />
                  <Label htmlFor="enable_email_notifications">Activer les notifications email</Label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtp_host">Serveur SMTP</Label>
                    <Input
                      id="smtp_host"
                      value={formData?.smtp_host || ''}
                      onChange={(e) => handleInputChange('smtp_host', e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp_port">Port SMTP</Label>
                    <Input
                      id="smtp_port"
                      type="number"
                      value={formData?.smtp_port || ''}
                      onChange={(e) => handleInputChange('smtp_port', parseInt(e.target.value))}
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp_username">Nom d'utilisateur</Label>
                    <Input
                      id="smtp_username"
                      value={formData?.smtp_username || ''}
                      onChange={(e) => handleInputChange('smtp_username', e.target.value)}
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtp_password">Mot de passe</Label>
                    <Input
                      id="smtp_password"
                      type="password"
                      value={formData?.smtp_password || ''}
                      onChange={(e) => handleInputChange('smtp_password', e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shipping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Livraison</CardTitle>
                <CardDescription>
                  Gérer les paramètres de livraison
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shipping_cost">Coût de livraison ({formData?.currency || 'CDF'})</Label>
                    <Input
                      id="shipping_cost"
                      type="number"
                      value={formData?.shipping_cost || 0}
                      onChange={(e) => handleInputChange('shipping_cost', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="free_shipping_threshold">Seuil livraison gratuite ({formData?.currency || 'CDF'})</Label>
                    <Input
                      id="free_shipping_threshold"
                      type="number"
                      value={formData?.free_shipping_threshold || ''}
                      onChange={(e) => handleInputChange('free_shipping_threshold', parseFloat(e.target.value) || null)}
                      placeholder="50000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Taxes et frais
                </CardTitle>
                <CardDescription>
                  Configuration des taxes et frais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tax_rate">Taux de taxe (%)</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    step="0.01"
                    value={formData?.tax_rate || 0}
                    onChange={(e) => handleInputChange('tax_rate', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
