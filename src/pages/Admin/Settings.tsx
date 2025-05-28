
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettings } from '@/hooks/useSettings';
import { useForm } from 'react-hook-form';
import { Loader2, Building, Mail, Phone, MapPin, DollarSign, Truck } from 'lucide-react';

const Settings = () => {
  const { settings, isLoading, updateSetting } = useSettings();
  const { register, handleSubmit, setValue } = useForm();

  React.useEffect(() => {
    if (settings) {
      setValue('company_name', settings.company_name);
      setValue('company_email', settings.company_email);
      setValue('company_phone', settings.company_phone);
      setValue('company_address', JSON.stringify(settings.company_address, null, 2));
      setValue('currency', settings.currency);
      setValue('tax_rate', settings.tax_rate);
      setValue('shipping_fee', settings.shipping_fee);
      setValue('free_shipping_threshold', settings.free_shipping_threshold);
    }
  }, [settings, setValue]);

  const onSubmit = async (data: any) => {
    try {
      // Update company info
      await updateSetting.mutateAsync({ key: 'company_name', value: data.company_name });
      await updateSetting.mutateAsync({ key: 'company_email', value: data.company_email });
      await updateSetting.mutateAsync({ key: 'company_phone', value: data.company_phone });
      
      // Parse and update address
      try {
        const address = JSON.parse(data.company_address);
        await updateSetting.mutateAsync({ key: 'company_address', value: address });
      } catch (e) {
        console.error('Invalid JSON for address');
      }

      // Update financial settings
      await updateSetting.mutateAsync({ key: 'currency', value: data.currency });
      await updateSetting.mutateAsync({ key: 'tax_rate', value: parseFloat(data.tax_rate) });
      await updateSetting.mutateAsync({ key: 'shipping_fee', value: parseFloat(data.shipping_fee) });
      await updateSetting.mutateAsync({ key: 'free_shipping_threshold', value: parseFloat(data.free_shipping_threshold) });
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">Configurez votre boutique en ligne</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="company" className="space-y-4">
          <TabsList>
            <TabsTrigger value="company">Entreprise</TabsTrigger>
            <TabsTrigger value="financial">Financier</TabsTrigger>
            <TabsTrigger value="shipping">Livraison</TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Informations de l'entreprise
                </CardTitle>
                <CardDescription>
                  Gérez les informations de base de votre entreprise
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Nom de l'entreprise</Label>
                    <Input
                      id="company_name"
                      {...register('company_name')}
                      placeholder="BeShopping"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="company_email">Email de contact</Label>
                    <Input
                      id="company_email"
                      type="email"
                      {...register('company_email')}
                      placeholder="contact@beshopping.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_phone">Téléphone</Label>
                  <Input
                    id="company_phone"
                    {...register('company_phone')}
                    placeholder="+243123456789"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_address">Adresse (JSON)</Label>
                  <Textarea
                    id="company_address"
                    {...register('company_address')}
                    placeholder='{"street": "Av. des Cliniques", "city": "Kinshasa", "country": "RDC"}'
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Paramètres financiers
                </CardTitle>
                <CardDescription>
                  Configurez la devise et les taxes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Devise</Label>
                    <Input
                      id="currency"
                      {...register('currency')}
                      placeholder="CDF"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tax_rate">Taux de taxe (%)</Label>
                    <Input
                      id="tax_rate"
                      type="number"
                      step="0.01"
                      {...register('tax_rate')}
                      placeholder="0"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Paramètres de livraison
                </CardTitle>
                <CardDescription>
                  Configurez les frais et seuils de livraison
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="shipping_fee">Frais de livraison (CDF)</Label>
                    <Input
                      id="shipping_fee"
                      type="number"
                      {...register('shipping_fee')}
                      placeholder="5000"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="free_shipping_threshold">Seuil livraison gratuite (CDF)</Label>
                    <Input
                      id="free_shipping_threshold"
                      type="number"
                      {...register('free_shipping_threshold')}
                      placeholder="50000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-6">
          <Button type="submit" disabled={updateSetting.isPending}>
            {updateSetting.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Sauvegarder les paramètres
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
