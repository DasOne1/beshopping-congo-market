
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCategories, Category } from '@/hooks/useCategories';
import ImageUpload from '@/components/Admin/ImageUpload';
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
    image: '',
    parent_id: null,
    is_visible: true
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
      const submitData = {
        ...formData,
        parent_id: formData.parent_id === 'none' ? null : formData.parent_id
      };

      if (isEditing && id) {
        await updateCategory.mutateAsync({ ...submitData, id } as Category & { id: string });
      } else {
        await createCategory.mutateAsync(submitData as Omit<Category, 'id' | 'created_at' | 'updated_at'>);
      }
      navigate('/dasgabriel@adminaccess/categories');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  // Obtenir les catégories principales (qui peuvent être parentes)
  const parentCategories = categories.filter(cat => !cat.parent_id && cat.id !== id);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dasgabriel@adminaccess/categories')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEditing ? 'Modifiez les informations de la catégorie' : 'Créez une nouvelle catégorie ou sous-catégorie'}
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
                    <Label htmlFor="parent_id">Catégorie parente</Label>
                    <Select 
                      value={formData.parent_id || 'none'} 
                      onValueChange={(value) => handleInputChange('parent_id', value === 'none' ? null : value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une catégorie parente (optionnel)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Catégorie principale</SelectItem>
                        {parentCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Laisser vide pour créer une catégorie principale, ou choisir une catégorie parente pour créer une sous-catégorie
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

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_visible"
                      checked={formData.is_visible || false}
                      onCheckedChange={(checked) => handleInputChange('is_visible', checked)}
                    />
                    <Label htmlFor="is_visible">Catégorie visible</Label>
                    <p className="text-xs text-gray-500">
                      Les catégories masquées ne sont pas visibles pour les utilisateurs
                    </p>
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
                  onClick={() => navigate('/dasgabriel@adminaccess/categories')}
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
