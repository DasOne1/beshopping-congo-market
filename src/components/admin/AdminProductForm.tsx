
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

const productSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  original_price: z.number().min(0, 'Le prix doit être positif'),
  discount: z.number().min(0).max(100).optional(),
  stock: z.number().min(0, 'Le stock ne peut pas être négatif'),
  category_id: z.string().optional(),
  images: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  is_visible: z.boolean(),
  status: z.enum(['active', 'inactive', 'draft']),
  sku: z.string().optional(),
  weight: z.number().min(0).optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
  featured: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AdminProductFormProps {
  product?: any;
  onClose: () => void;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({ product, onClose }) => {
  const { createProduct, updateProduct } = useProducts();
  const { categories } = useCategories();
  const [imageInput, setImageInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      original_price: product?.original_price || 0,
      discount: product?.discount || 0,
      stock: product?.stock || 0,
      category_id: product?.category_id || '',
      images: product?.images || [],
      tags: product?.tags || [],
      is_visible: product?.is_visible ?? true,
      status: product?.status || 'active',
      sku: product?.sku || '',
      weight: product?.weight || 0,
      dimensions: product?.dimensions || { length: 0, width: 0, height: 0 },
      featured: product?.featured || false,
    },
  });

  const addImage = () => {
    if (imageInput.trim()) {
      const currentImages = form.getValues('images') || [];
      form.setValue('images', [...currentImages, imageInput.trim()]);
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues('images') || [];
    form.setValue('images', currentImages.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = form.getValues('tags') || [];
      form.setValue('tags', [...currentTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index: number) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const discountedPrice = data.discount 
        ? data.original_price * (1 - data.discount / 100) 
        : data.original_price;

      const productData = {
        name: data.name,
        description: data.description || null,
        original_price: data.original_price,
        discounted_price: discountedPrice,
        discount: data.discount || 0,
        stock: data.stock,
        category_id: data.category_id || null,
        images: data.images || [],
        tags: data.tags || [],
        is_visible: data.is_visible,
        status: data.status,
        sku: data.sku || null,
        weight: data.weight || null,
        dimensions: data.dimensions || null,
        featured: data.featured || false,
        popular: 0
      };

      if (product) {
        await updateProduct.mutateAsync({ 
          id: product.id, 
          ...productData
        });
      } else {
        await createProduct.mutateAsync(productData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom du produit *</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du produit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="SKU-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Description du produit"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="original_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix original *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remise (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    max="100"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock *</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Images */}
        <div>
          <FormLabel>Images</FormLabel>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="URL de l'image"
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
            />
            <Button type="button" onClick={addImage}>Ajouter</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(form.watch('images') || []).map((image, index) => (
              <div key={index} className="relative group">
                <img src={image} alt="" className="w-20 h-20 object-cover rounded" />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100"
                  onClick={() => removeImage(index)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <FormLabel>Tags</FormLabel>
          <div className="flex gap-2 mb-2">
            <Input
              placeholder="Nouveau tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <Button type="button" onClick={addTag}>Ajouter</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(form.watch('tags') || []).map((tag, index) => (
              <div key={index} className="bg-secondary px-2 py-1 rounded text-sm flex items-center gap-2">
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-destructive hover:text-destructive"
                  onClick={() => removeTag(index)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="is_visible"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Visible</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Le produit est visible sur le site
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

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Mis en avant</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    Produit mis en avant sur la page d'accueil
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
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Annuler
          </Button>
          <Button 
            type="submit" 
            className="flex-1"
            disabled={createProduct.isPending || updateProduct.isPending}
          >
            {createProduct.isPending || updateProduct.isPending 
              ? 'Enregistrement...' 
              : product ? 'Modifier' : 'Créer'
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};
