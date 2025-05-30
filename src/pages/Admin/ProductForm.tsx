
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/Admin/AdminLayout';
import ImageUpload from '@/components/Admin/ImageUpload';
import { Json } from '@/integrations/supabase/types';

const productSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().min(1, 'La description est requise'),
  original_price: z.string().min(1, 'Le prix est requis'),
  discounted_price: z.string().optional(),
  discount: z.string().optional(),
  stock: z.string().min(1, 'Le stock est requis'),
  category_id: z.string().optional(),
  images: z.array(z.string()).min(1, 'Au moins une image est requise'),
  featured: z.boolean(),
  popular: z.string().default('0'),
  sku: z.string().optional(),
  weight: z.string().optional(),
  dimensions: z.record(z.unknown()).optional(),
  status: z.enum(['active', 'draft', 'archived']),
  tags: z.string().default('')
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { createProduct, updateProduct, products, isLoading: isLoadingProduct } = useProducts();

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      original_price: '',
      discounted_price: '',
      discount: '',
      stock: '',
      category_id: '',
      images: [],
      featured: false,
      status: 'draft',
      popular: '0',
      sku: '',
      weight: '',
      dimensions: {},
      tags: ''
    }
  });

  const watchedImages = watch('images');
  const watchedOriginalPrice = watch('original_price');
  const watchedDiscountedPrice = watch('discounted_price');

  // Auto-calculate discount percentage
  React.useEffect(() => {
    if (watchedOriginalPrice && watchedDiscountedPrice) {
      const original = parseFloat(watchedOriginalPrice);
      const discounted = parseFloat(watchedDiscountedPrice);
      if (original > 0 && discounted > 0 && discounted < original) {
        const discountPercent = Math.round(((original - discounted) / original) * 100);
        setValue('discount', discountPercent.toString());
      }
    }
  }, [watchedOriginalPrice, watchedDiscountedPrice, setValue]);

  useEffect(() => {
    if (id) {
      const product = products.find(p => p.id === id);
      if (product) {
        setValue('name', product.name);
        setValue('description', product.description || '');
        setValue('original_price', product.original_price.toString());
        setValue('discounted_price', product.discounted_price ? product.discounted_price.toString() : '');
        setValue('discount', product.discount ? product.discount.toString() : '');
        setValue('stock', product.stock.toString());
        setValue('category_id', product.category_id || '');
        setValue('images', product.images || []);
        setValue('featured', product.featured || false);
        setValue('status', product.status as 'active' | 'draft' | 'archived' || 'draft');
        setValue('popular', product.popular?.toString() || '0');
        setValue('sku', product.sku || '');
        setValue('weight', product.weight ? product.weight.toString() : '');
        setValue('dimensions', (product.dimensions as Record<string, unknown>) || {});
        setValue('tags', Array.isArray(product.tags) ? product.tags.join(', ') : '');
      }
    }
  }, [id, setValue, products]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      const productData = {
        name: data.name,
        description: data.description,
        original_price: parseFloat(data.original_price),
        discounted_price: data.discounted_price ? parseFloat(data.discounted_price) : null,
        discount: data.discount ? parseInt(data.discount) : null,
        stock: parseInt(data.stock),
        category_id: data.category_id || null,
        images: data.images,
        featured: data.featured,
        popular: parseInt(data.popular || '0'),
        sku: data.sku || null,
        weight: data.weight ? parseFloat(data.weight) : null,
        dimensions: data.dimensions as Json,
        status: data.status,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []
      };

      if (id) {
        await updateProduct.mutateAsync({ id, ...productData });
      } else {
        await createProduct.mutateAsync(productData);
      }
      navigate('/admin/catalog');
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleImagesChange = (images: string[]) => {
    setValue('images', images);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/catalog')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {id ? 'Modifier le produit' : 'Ajouter un produit'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {id ? 'Modifiez les informations du produit' : 'Créez un nouveau produit'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations principales */}
            <Card>
              <CardHeader>
                <CardTitle>Informations principales</CardTitle>
                <CardDescription>
                  Détails de base du produit
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du produit *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Nom du produit"
                    required
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Description du produit"
                    rows={4}
                    required
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category_id">Catégorie</Label>
                  <Select 
                    onValueChange={(value) => setValue('category_id', value)}
                    value={watch('category_id') || ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucune catégorie</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    {...register('sku')}
                    placeholder="SKU-001"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Prix et stock */}
            <Card>
              <CardHeader>
                <CardTitle>Prix et stock</CardTitle>
                <CardDescription>
                  Configuration financière et inventaire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="original_price">Prix original (FC) *</Label>
                    <Input
                      id="original_price"
                      {...register('original_price')}
                      placeholder="0"
                      type="number"
                      step="0.01"
                      required
                    />
                    {errors.original_price && (
                      <p className="text-sm text-red-500 mt-1">{errors.original_price.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="discounted_price">Prix réduit (FC)</Label>
                    <Input
                      id="discounted_price"
                      {...register('discounted_price')}
                      placeholder="0"
                      type="number"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discount">Remise (%)</Label>
                    <Input
                      id="discount"
                      {...register('discount')}
                      placeholder="0"
                      type="number"
                      readOnly
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Calculé automatiquement
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock disponible *</Label>
                    <Input
                      id="stock"
                      {...register('stock')}
                      placeholder="0"
                      type="number"
                      required
                    />
                    {errors.stock && (
                      <p className="text-sm text-red-500 mt-1">{errors.stock.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="weight">Poids (kg)</Label>
                    <Input
                      id="weight"
                      {...register('weight')}
                      placeholder="0.0"
                      type="number"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="popular">Popularité</Label>
                    <Input
                      id="popular"
                      {...register('popular')}
                      placeholder="0"
                      type="number"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={watch('featured')}
                    onCheckedChange={(checked) => setValue('featured', checked)}
                  />
                  <Label htmlFor="featured">Produit vedette</Label>
                </div>

                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select 
                    onValueChange={(value) => setValue('status', value as 'active' | 'draft' | 'archived')}
                    value={watch('status')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="archived">Archivé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Images et tags */}
          <Card>
            <CardHeader>
              <CardTitle>Images et tags</CardTitle>
              <CardDescription>
                Gestion des images et des tags du produit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUpload
                label="Images du produit *"
                images={watchedImages}
                onImagesChange={handleImagesChange}
                maxImages={5}
              />
              {errors.images && (
                <p className="text-sm text-red-500">{errors.images.message}</p>
              )}

              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  {...register('tags')}
                  placeholder="Tags séparés par des virgules"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Séparez les tags par des virgules
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/catalog')}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? 'En cours...' : (id ? 'Mettre à jour' : 'Créer le produit')}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
