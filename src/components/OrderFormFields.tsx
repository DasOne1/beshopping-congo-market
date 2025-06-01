
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';

interface OrderFormFieldsProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  children: React.ReactNode;
}

const OrderFormFields: React.FC<OrderFormFieldsProps> = ({ form, onSubmit, children }) => {
  const { isAuthenticated } = useAuth();
  const { userProfile } = useUserProfile();

  // Pré-remplir le formulaire avec les données utilisateur
  useEffect(() => {
    if (isAuthenticated && userProfile) {
      form.setValue('customerName', userProfile.name);
      form.setValue('customerPhone', userProfile.phone);
      form.setValue('customerAddress', userProfile.address);
    }
  }, [isAuthenticated, userProfile, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom complet</FormLabel>
              <FormControl>
                <Input
                  placeholder="Votre nom complet"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customerPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de téléphone</FormLabel>
              <FormControl>
                <Input
                  placeholder="Votre numéro de téléphone"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customerAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresse de livraison</FormLabel>
              <FormControl>
                <Input
                  placeholder="Votre adresse de livraison"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {children}
      </form>
    </Form>
  );
};

export default OrderFormFields;
