
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCategories } from '@/hooks/useCategories';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '@/components/Admin/AdminLayout';
import ImageUpload from '@/components/Admin/ImageUpload';

const categorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  slug: z.string().min(1, 'Le slug est requis'),
  description: z.string().optional(),
  image: z.string().optional(),
  parent_id: z.string().optional()
});

type CategoryFormData = z.infer<typeof categorySchema>;

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createCategory, updateCategory, categories, isLoading: isLoadingCategory } = useCategories();

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      image: '',
      parent_id: ''
    }
  });

  const watchedName = watch('name');
  const watchedImage = watch('image');

  // Auto-generate slug from name
  React.useEffect(() => {
    if (watchedName && !id) {
      const slug = watchedName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [watchedName, setValue, id]);

  useEffect(() => {
    if (id) {
      const category = categories.find(cat => cat.id === id);
      if (category) {
        setValue('name', category.name);
        setValue('slug', category.slug);
        setValue('description', category.description || '');
        setValue('image', category.image || '');
        setValue('parent_id', category.parent_id || '');
      }
    }
  }, [id, setValue, categories]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const categoryData = {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        image: data.image || null,
        parent_id: data.parent_id || null
      };

      if (id) {
        await updateCategory.mutateAsync({ id, ...categoryData });
      } else {
        await createCategory.mutateAsync(categoryData);
      }
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleImageChange = (images: string[]) => {
    if (images.length > 0) {
      setValue('image', images[0]);
    } else {
      setValue('image', '');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/categories')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {id ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {id ? 'Modifiez les informations de la catégorie' : 'Créez une nouvelle catégorie'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Informations de la catégorie</CardTitle>
              <CardDescription>
                Remplissez tous les champs requis pour {id ? 'modifier' : 'créer'} la catégorie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom de la catégorie *</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Nom de la catégorie"
                      required
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      {...register('slug')}
                      placeholder="slug-de-la-categorie"
                      required
                    />
                    {errors.slug && (
                      <p className="text-sm text-red-500 mt-1">{errors.slug.message}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      URL de la catégorie (généré automatiquement à partir du nom)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="Description de la catégorie"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="parent_id">Catégorie parente</Label>
                    <Select
                      onValueChange={(value) => setValue('parent_id', value || '')}
                      value={watch('parent_id') || ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie parente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Aucune</SelectItem>
                        {categories
                          .filter(cat => cat.id !== id)
                          .map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <ImageUpload
                    label="Image de la catégorie"
                    images={watchedImage ? [watchedImage] : []}
                    onImagesChange={handleImageChange}
                    maxImages={1}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/categories')}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'En cours...' : (id ? 'Mettre à jour' : 'Créer la catégorie')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CategoryForm;
