
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Loader2, FolderOpen, Upload } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import ImageUpload from '@/components/Admin/ImageUpload';
import AdminLayout from '@/components/Admin/AdminLayout';
import { toast } from '@/components/ui/use-toast';

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get('parent');
  const isEditing = !!id;
  
  const { categories, createCategory, updateCategory } = useCategories();
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parent_id: parentId || '',
    is_visible: true
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Obtenir la catégorie parent si spécifiée
  const parentCategory = parentId ? categories.find(cat => cat.id === parentId) : null;

  useEffect(() => {
    if (isEditing && id) {
      const category = categories.find(c => c.id === id);
      if (category) {
        setFormData({
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          image: category.image || '',
          parent_id: category.parent_id || '',
          is_visible: category.is_visible ?? true
        });
      }
    }
  }, [isEditing, id, categories]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: !isEditing ? generateSlug(value) : prev.slug
    }));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie est obligatoire",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.slug.trim()) {
      toast({
        title: "Erreur",
        description: "Le slug est obligatoire",
        variant: "destructive",
      });
      return false;
    }

    // Vérifier que le slug est unique
    const existingCategory = categories.find(cat => 
      cat.slug === formData.slug && cat.id !== id
    );
    
    if (existingCategory) {
      toast({
        title: "Erreur",
        description: "Ce slug est déjà utilisé par une autre catégorie",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const categoryData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || undefined,
        image: formData.image.trim() || undefined,
        parent_id: formData.parent_id || undefined,
        is_visible: formData.is_visible
      };

      if (isEditing && id) {
        await updateCategory.mutateAsync({ id, ...categoryData });
      } else {
        await createCategory.mutateAsync(categoryData);
      }
      
      navigate('/dasgabriel@adminaccess/categories');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrer les catégories pour éviter la sélection circulaire
  const availableParentCategories = categories.filter(cat => {
    if (isEditing && id) {
      // Exclure la catégorie elle-même et ses descendants
      return cat.id !== id && cat.parent_id !== id;
    }
    return cat.parent_id === null; // Seules les catégories racines peuvent être parentes
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/dasgabriel@adminaccess/categories')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h1>
              <p className="text-muted-foreground">
                {parentCategory ? (
                  <>Sous-catégorie de "{parentCategory.name}"</>
                ) : (
                  <>
                    {isEditing ? 'Modifiez les informations de la catégorie' : 'Créez une nouvelle catégorie'}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Informations générales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FolderOpen className="mr-2 h-5 w-5" />
                  Informations générales
                </CardTitle>
                <CardDescription>
                  Informations de base de la catégorie
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom de la catégorie *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Nom de la catégorie"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug (URL) *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="slug-de-la-categorie"
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Utilisé dans l'URL. Seuls les lettres, chiffres et tirets sont autorisés.
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Description de la catégorie"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="parent_id">Catégorie parente</Label>
                  <Select 
                    value={formData.parent_id} 
                    onValueChange={(value) => handleInputChange('parent_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Aucune (catégorie racine)" />
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

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_visible"
                    checked={formData.is_visible}
                    onCheckedChange={(checked) => handleInputChange('is_visible', checked)}
                  />
                  <Label htmlFor="is_visible">
                    Visible sur le site
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Image de la catégorie
                </CardTitle>
                <CardDescription>
                  Image représentant la catégorie
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.image}
                  onChange={(url) => handleInputChange('image', url)}
                  onError={(error) => {
                    toast({
                      title: "Erreur",
                      description: error,
                      variant: "destructive",
                    });
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dasgabriel@adminaccess/categories')}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Modification...' : 'Création...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Modifier' : 'Créer'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CategoryForm;
