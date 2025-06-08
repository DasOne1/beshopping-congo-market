
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/hooks/useSettings';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Settings, Save, Store, Phone, Mail, MapPin } from 'lucide-react';

const AdminSettings = () => {
  const { settings, updateSetting, isLoading } = useSettings();
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    whatsapp_number: '',
    enable_notifications: true,
    enable_email_orders: true,
  });

  useEffect(() => {
    if (settings && Array.isArray(settings)) {
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, any>);

      setFormData({
        site_name: settingsMap.site_name || '',
        site_description: settingsMap.site_description || '',
        contact_email: settingsMap.contact_email || '',
        contact_phone: settingsMap.contact_phone || '',
        contact_address: settingsMap.contact_address || '',
        whatsapp_number: settingsMap.whatsapp_number || '',
        enable_notifications: settingsMap.enable_notifications !== false,
        enable_email_orders: settingsMap.enable_email_orders !== false,
      });
    }
  }, [settings]);

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async (key: string, value: any) => {
    try {
      await updateSetting.mutateAsync({ key, value });
      toast({
        title: "Paramètre mis à jour",
        description: "Le paramètre a été sauvegardé avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le paramètre.",
        variant: "destructive",
      });
    }
  };

  const handleSaveAll = async () => {
    try {
      for (const [key, value] of Object.entries(formData)) {
        await updateSetting.mutateAsync({ key, value });
      }
      toast({
        title: "Paramètres mis à jour",
        description: "Tous les paramètres ont été sauvegardés avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder certains paramètres.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Settings className="mr-2 h-8 w-8" />
            Paramètres
          </h1>
          <p className="text-muted-foreground">Gérez les paramètres de votre application</p>
        </div>
        <Button onClick={handleSaveAll} disabled={updateSetting.isPending}>
          <Save className="mr-2 h-4 w-4" />
          Sauvegarder tout
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations générales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="mr-2 h-5 w-5" />
                Informations générales
              </CardTitle>
              <CardDescription>
                Paramètres de base de votre boutique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="site_name">Nom du site</Label>
                <Input
                  id="site_name"
                  value={formData.site_name}
                  onChange={(e) => handleInputChange('site_name', e.target.value)}
                  placeholder="BeShopping"
                />
              </div>
              <div>
                <Label htmlFor="site_description">Description du site</Label>
                <Textarea
                  id="site_description"
                  value={formData.site_description}
                  onChange={(e) => handleInputChange('site_description', e.target.value)}
                  placeholder="Votre boutique en ligne de confiance"
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Informations de contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                Informations de contact
              </CardTitle>
              <CardDescription>
                Coordonnées de contact pour vos clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contact_email">Email de contact</Label>
                <div className="flex">
                  <Mail className="w-10 px-3 h-10 border border-r-0 rounded-l bg-muted flex items-center justify-center" />
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    placeholder="contact@beshopping.com"
                    className="rounded-l-none"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contact_phone">Téléphone de contact</Label>
                <div className="flex">
                  <Phone className="w-10 px-3 h-10 border border-r-0 rounded-l bg-muted flex items-center justify-center" />
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    placeholder="+33 1 23 45 67 89"
                    className="rounded-l-none"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="whatsapp_number">Numéro WhatsApp</Label>
                <Input
                  id="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                  placeholder="+33123456789"
                />
              </div>
              <div>
                <Label htmlFor="contact_address">Adresse</Label>
                <div className="flex">
                  <MapPin className="w-10 px-3 h-10 border border-r-0 rounded-l bg-muted flex items-center justify-center" />
                  <Textarea
                    id="contact_address"
                    value={formData.contact_address}
                    onChange={(e) => handleInputChange('contact_address', e.target.value)}
                    placeholder="123 Rue de la Paix, 75001 Paris, France"
                    className="rounded-l-none min-h-[80px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Préférences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
              <CardDescription>
                Paramètres de fonctionnement de votre boutique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notifications actives</Label>
                  <div className="text-sm text-muted-foreground">
                    Recevoir des notifications pour les nouvelles commandes
                  </div>
                </div>
                <Switch
                  checked={formData.enable_notifications}
                  onCheckedChange={(checked) => handleInputChange('enable_notifications', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Emails de commande</Label>
                  <div className="text-sm text-muted-foreground">
                    Envoyer des emails de confirmation aux clients
                  </div>
                </div>
                <Switch
                  checked={formData.enable_email_orders}
                  onCheckedChange={(checked) => handleInputChange('enable_email_orders', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSettings;
