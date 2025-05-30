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

const categorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().min(1, 'La description est requise'),
  slug: z.string().optional(),
  image: z.string().optional(),
  parentId: z.string().optional(),
  status: z.enum(['active', 'inactive'])
});

type CategoryFormData = z.infer<typeof categorySchema>;

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createCategory, updateCategory, categories, isLoading: isLoadingCategory } = useCategories();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active'
    }
  });

  useEffect(() => {
    if (id) {
      const category = categories.find(cat => cat.id === id);
      if (category) {
        setValue('name', category.name);
        setValue('description', category.description);
        setValue('status', 'active');
      }
    }
  }, [id, setValue, categories]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const categoryData = {
        name: data.name,
        description: data.description,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
        image: data.image || '/placeholder.svg',
        parentId: data.parentId,
        status: data.status
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
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="Description de la catégorie"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      {...register('slug')}
                      placeholder="slug-de-la-categorie"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Laissez vide pour générer automatiquement à partir du nom
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="image">Image</Label>
                    <Input
                      id="image"
                      {...register('image')}
                      placeholder="URL de l'image"
                    />
                  </div>

                  <div>
                    <Label htmlFor="parentId">Catégorie parente</Label>
                    <Select
                      onValueChange={(value) => setValue('parentId', value)}
                      defaultValue=""
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

                  <div>
                    <Label htmlFor="status">Statut</Label>
                    <Select
                      onValueChange={(value) => setValue('status', value as 'active' | 'inactive')}
                      defaultValue="active"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
