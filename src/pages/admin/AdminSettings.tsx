
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Store,
  Bell,
  Shield,
  Users,
  Mail,
  Phone,
  MapPin,
  Save,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSettings } from '@/hooks/useSettings';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminSettings = () => {
  const { settings, isLoading, updateSetting } = useSettings();
  const { adminProfile } = useAdminAuth();
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    storeEmail: '',
    storePhone: '',
    storeAddress: '',
    notifications: true,
    emailNotifications: true,
    orderNotifications: true,
  });

  const handleSaveSettings = async () => {
    try {
      // Save each setting
      await Promise.all([
        updateSetting.mutateAsync({ key: 'store_name', value: formData.storeName }),
        updateSetting.mutateAsync({ key: 'store_description', value: formData.storeDescription }),
        updateSetting.mutateAsync({ key: 'store_email', value: formData.storeEmail }),
        updateSetting.mutateAsync({ key: 'store_phone', value: formData.storePhone }),
        updateSetting.mutateAsync({ key: 'store_address', value: formData.storeAddress }),
        updateSetting.mutateAsync({ key: 'notifications_enabled', value: formData.notifications }),
        updateSetting.mutateAsync({ key: 'email_notifications', value: formData.emailNotifications }),
        updateSetting.mutateAsync({ key: 'order_notifications', value: formData.orderNotifications }),
      ]);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  React.useEffect(() => {
    if (settings) {
      setFormData({
        storeName: settings.find(s => s.key === 'store_name')?.value || '',
        storeDescription: settings.find(s => s.key === 'store_description')?.value || '',
        storeEmail: settings.find(s => s.key === 'store_email')?.value || '',
        storePhone: settings.find(s => s.key === 'store_phone')?.value || '',
        storeAddress: settings.find(s => s.key === 'store_address')?.value || '',
        notifications: settings.find(s => s.key === 'notifications_enabled')?.value ?? true,
        emailNotifications: settings.find(s => s.key === 'email_notifications')?.value ?? true,
        orderNotifications: settings.find(s => s.key === 'order_notifications')?.value ?? true,
      });
    }
  }, [settings]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez les paramètres de votre boutique et de votre compte
        </p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="store">Boutique</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="profile">Profil</TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5" />
                  Informations de la Boutique
                </CardTitle>
                <CardDescription>
                  Configurez les informations principales de votre boutique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Nom de la boutique</Label>
                    <Input
                      id="storeName"
                      value={formData.storeName}
                      onChange={(e) => handleInputChange('storeName', e.target.value)}
                      placeholder="BeShopping Congo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeEmail">Email de contact</Label>
                    <Input
                      id="storeEmail"
                      type="email"
                      value={formData.storeEmail}
                      onChange={(e) => handleInputChange('storeEmail', e.target.value)}
                      placeholder="contact@beshopping.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Description de la boutique</Label>
                  <Textarea
                    id="storeDescription"
                    value={formData.storeDescription}
                    onChange={(e) => handleInputChange('storeDescription', e.target.value)}
                    placeholder="Décrivez votre boutique..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storePhone">Téléphone</Label>
                    <Input
                      id="storePhone"
                      value={formData.storePhone}
                      onChange={(e) => handleInputChange('storePhone', e.target.value)}
                      placeholder="+243 978 100 940"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeAddress">Adresse</Label>
                    <Input
                      id="storeAddress"
                      value={formData.storeAddress}
                      onChange={(e) => handleInputChange('storeAddress', e.target.value)}
                      placeholder="Lubumbashi, RDC"
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSettings} className="gap-2">
                  <Save className="h-4 w-4" />
                  Enregistrer les paramètres
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configurez vos préférences de notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notifications">Notifications générales</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications pour les événements importants
                      </p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={formData.notifications}
                      onCheckedChange={(value) => handleInputChange('notifications', value)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Notifications email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications par email
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={formData.emailNotifications}
                      onCheckedChange={(value) => handleInputChange('emailNotifications', value)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="orderNotifications">Nouvelles commandes</Label>
                      <p className="text-sm text-muted-foreground">
                        Être notifié immédiatement des nouvelles commandes
                      </p>
                    </div>
                    <Switch
                      id="orderNotifications"
                      checked={formData.orderNotifications}
                      onCheckedChange={(value) => handleInputChange('orderNotifications', value)}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSettings} className="gap-2">
                  <Save className="h-4 w-4" />
                  Enregistrer les préférences
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Users Management */}
        <TabsContent value="users">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gestion des Utilisateurs Admin
                </CardTitle>
                <CardDescription>
                  Gérez les comptes administrateurs de votre boutique
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Administrateurs actuels</h4>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Ajouter un admin
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{adminProfile?.full_name}</TableCell>
                        <TableCell>{adminProfile?.email}</TableCell>
                        <TableCell>{adminProfile?.role}</TableCell>
                        <TableCell>
                          <span className="text-green-600">Actif</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" disabled>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Mon Profil Administrateur
                </CardTitle>
                <CardDescription>
                  Gérez vos informations personnelles d'administrateur
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      value={adminProfile?.full_name || ''}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={adminProfile?.email || ''}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Input
                      id="role"
                      value={adminProfile?.role || ''}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastLogin">Dernière connexion</Label>
                    <Input
                      id="lastLogin"
                      value={adminProfile?.last_login 
                        ? new Date(adminProfile.last_login).toLocaleString('fr-FR')
                        : 'Première connexion'
                      }
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memberSince">Membre depuis</Label>
                  <Input
                    id="memberSince"
                    value={adminProfile?.created_at 
                      ? new Date(adminProfile.created_at).toLocaleDateString('fr-FR')
                      : ''
                    }
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  Pour modifier vos informations personnelles, contactez un super administrateur.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
