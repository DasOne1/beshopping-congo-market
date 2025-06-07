
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCategories } from '@/hooks/useCategories';

const categorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  slug: z.string().min(1, 'Le slug est requis'),
  image: z.string().optional(),
  is_visible: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface AdminCategoryFormProps {
  category?: any;
  onClose: () => void;
}

export const AdminCategoryForm: React.FC<AdminCategoryFormProps> = ({ category, onClose }) => {
  const { createCategory, updateCategory } = useCategories();

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
      slug: category?.slug || '',
      image: category?.image || '',
      is_visible: category?.is_visible ?? true,
    },
  });

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    form.setValue('slug', slug);
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (category) {
        await updateCategory.mutateAsync({ id: category.id, ...data });
      } else {
        await createCategory.mutateAsync(data);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de la catégorie *</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nom de la catégorie" 
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    if (!category) {
                      handleNameChange(e.target.value);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug *</FormLabel>
              <FormControl>
                <Input placeholder="slug-de-la-categorie" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Description de la catégorie"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://exemple.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_visible"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Visible</FormLabel>
                <div className="text-sm text-muted-foreground">
                  La catégorie est visible sur le site
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button 
            type="submit" 
            className="flex-1"
            disabled={createCategory.isPending || updateCategory.isPending}
          >
            {createCategory.isPending || updateCategory.isPending 
              ? 'Enregistrement...' 
              : category ? 'Modifier' : 'Créer'
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};
