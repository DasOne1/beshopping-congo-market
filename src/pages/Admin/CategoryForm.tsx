
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCategories, Category } from '@/hooks/useCategories';
import AdminLayout from '@/components/Admin/AdminLayout';
import { toast } from '@/hooks/use-toast';

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { categories, createCategory, updateCategory } = useCategories();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parent_id: '',
    is_visible: true,
  });

  const isEditing = Boolean(id);
  const parentCategories = categories.filter(cat => !cat.parent_id); // Seulement les catégories principales

  useEffect(() => {
    if (isEditing && id) {
      const category = categories.find(cat => cat.id === id);
      if (category) {
        setFormData({
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          image: category.image || '',
          parent_id: category.parent_id || '',
          is_visible: category.is_visible,
        });
      }
    }
  }, [isEditing, id, categories]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEditing) {
      const slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, isEditing]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name.trim()) {
        toast({
          title: "Erreur",
          description: "Le nom de la catégorie est obligatoire",
          variant: "destructive",
        });
        return;
      }

      if (isEditing && id) {
        await updateCategory.mutateAsync({
          id,
          ...formData,
        });
      } else {
        await createCategory.mutateAsync(formData);
      }

      navigate('/dasgabriel@adminaccess/catalog/categories');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/dasgabriel@adminaccess/catalog/categories')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isEditing ? 'Modifiez les informations de la catégorie' : 'Créez une nouvelle catégorie'}
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Informations de la catégorie</CardTitle>
              <CardDescription>
                Remplissez les informations de la catégorie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nom */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de la catégorie *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ex: Électronique"
                      required
                    />
                  </div>

                  {/* Slug */}
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="Ex: electronique"
                    />
                    <p className="text-xs text-muted-foreground">
                      Utilisé dans l'URL. Se génère automatiquement si laissé vide.
                    </p>
                  </div>

                  {/* Catégorie parente */}
                  <div className="space-y-2">
                    <Label htmlFor="parent">Catégorie parente (optionnel)</Label>
                    <Select 
                      value={formData.parent_id} 
                      onValueChange={(value) => handleInputChange('parent_id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une catégorie parente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Aucune (catégorie principale)</SelectItem>
                        {parentCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Sélectionnez une catégorie parente pour créer une sous-catégorie.
                    </p>
                  </div>

                  {/* Visibilité */}
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibilité</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="visibility"
                        checked={formData.is_visible}
                        onCheckedChange={(checked) => handleInputChange('is_visible', checked)}
                      />
                      <span className="text-sm">
                        {formData.is_visible ? 'Visible sur le site' : 'Masquée du site'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Description de la catégorie..."
                    rows={4}
                  />
                </div>

                {/* Image */}
                <div className="space-y-2">
                  <Label htmlFor="image">URL de l'image</Label>
                  <div className="space-y-4">
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      placeholder="https://exemple.com/image.jpg"
                    />
                    {formData.image && (
                      <div className="relative w-32 h-32">
                        <img
                          src={formData.image}
                          alt="Aperçu"
                          className="w-full h-full object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => handleInputChange('image', '')}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/dasgabriel@adminaccess/catalog/categories')}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || createCategory.isPending || updateCategory.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? 'Sauvegarde...' : isEditing ? 'Modifier' : 'Créer'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default CategoryForm;
