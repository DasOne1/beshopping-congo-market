
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCategories, Category } from '@/hooks/useCategories';
import { ImageUpload } from '@/components/Admin/ImageUpload';
import AdminLayout from '@/components/Admin/AdminLayout';

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const { categories, createCategory, updateCategory } = useCategories();
  
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    if (isEditing && id && categories.length > 0) {
      const category = categories.find(c => c.id === id);
      if (category) {
        setFormData(category);
      }
    }
  }, [isEditing, id, categories]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleImageChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, image: images[0] || '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug) {
      return;
    }

    try {
      if (isEditing && id) {
        await updateCategory.mutateAsync({ ...formData, id } as Category & { id: string });
      } else {
        await createCategory.mutateAsync(formData as Omit<Category, 'id' | 'created_at' | 'updated_at'>);
      }
      navigate('/admin/categories');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
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
              {isEditing ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEditing ? 'Modifiez les informations de la catégorie' : 'Créez une nouvelle catégorie'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informations de la catégorie</CardTitle>
              <CardDescription>
                Remplissez tous les champs requis pour {isEditing ? 'modifier' : 'créer'} la catégorie
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom de la catégorie *</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Nom de la catégorie"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug || ''}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="slug-de-la-categorie"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Le slug est généré automatiquement à partir du nom
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Description de la catégorie"
                      rows={4}
                    />
                  </div>
                </div>

                <div>
                  <ImageUpload
                    images={formData.image ? [formData.image] : []}
                    onImagesChange={handleImageChange}
                    maxImages={1}
                    label="Image de la catégorie"
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
                  disabled={createCategory.isPending || updateCategory.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {createCategory.isPending || updateCategory.isPending 
                    ? (isEditing ? 'Mise à jour...' : 'Création...') 
                    : (isEditing ? 'Mettre à jour' : 'Créer la catégorie')
                  }
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
