
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useTranslation } from 'react-i18next';

interface FormData {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
}

interface OrderFormFieldsProps {
  form: UseFormReturn<FormData>;
  onSubmit: (data: FormData) => void;
  children: React.ReactNode;
}

const OrderFormFields: React.FC<OrderFormFieldsProps> = ({ form, onSubmit, children }) => {
  const { t } = useTranslation();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('form.customerName')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('form.customerName')}
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
              <FormLabel>{t('form.customerPhone')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('form.customerPhone')}
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
              <FormLabel>{t('form.customerAddress')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('form.customerAddress')}
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
