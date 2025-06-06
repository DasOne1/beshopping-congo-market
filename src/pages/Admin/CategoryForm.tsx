
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FolderOpen, Save } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import AdminLayout from '@/components/Admin/AdminLayout';
import { toast } from '@/components/ui/use-toast';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, createCategory, updateCategory, isLoading } = useCategories();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    image: '',
    parent_id: '',
    is_visible: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && categories.length > 0) {
      const category = categories.find(c => c.id === id);
      if (category) {
        setFormData({
          name: category.name,
          description: category.description || '',
          slug: category.slug,
          image: category.image || '',
          parent_id: category.parent_id || '',
          is_visible: category.is_visible
        });
      }
    }
  }, [id, isEditing, categories]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: prev.slug === generateSlug(prev.name) ? generateSlug(value) : prev.slug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie est obligatoire.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const categoryData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name),
        parent_id: formData.parent_id || null
      };

      if (isEditing) {
        await updateCategory.mutateAsync({
          id: id!,
          data: categoryData
        });
        toast({
          title: "Catégorie mise à jour",
          description: "La catégorie a été mise à jour avec succès.",
        });
      } else {
        await createCategory.mutateAsync(categoryData);
        toast({
          title: "Catégorie créée",
          description: "La nouvelle catégorie a été créée avec succès.",
        });
      }

      navigate('/dasgabriel@adminaccess/categories');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrer les catégories pour éviter la sélection de la catégorie actuelle ou de ses descendants
  const availableParentCategories = categories.filter(category => {
    if (isEditing && category.id === id) return false;
    if (isEditing && category.parent_id === id) return false;
    return true;
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-300">Chargement...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/dasgabriel@adminaccess/categories')}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux catégories
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <FolderOpen className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations de la catégorie</CardTitle>
            <CardDescription>
              {isEditing ? 'Modifiez les informations de cette catégorie' : 'Remplissez les informations pour créer une nouvelle catégorie'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom de la catégorie *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Ex: Électronique"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="Ex: electronique"
                  />
                  <p className="text-sm text-muted-foreground">
                    Généré automatiquement à partir du nom si vide
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parent_id">Catégorie parente</Label>
                  <Select
                    value={formData.parent_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, parent_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie parente (optionnel)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucune (catégorie racine)</SelectItem>
                      {availableParentCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">URL de l'image</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Description de la catégorie..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_visible"
                  checked={formData.is_visible}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_visible: checked }))}
                />
                <Label htmlFor="is_visible">Visible sur le site</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dasgabriel@adminaccess/categories')}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Sauvegarde...' : (isEditing ? 'Mettre à jour' : 'Créer')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CategoryForm;
