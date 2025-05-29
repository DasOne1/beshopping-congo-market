
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
import { useProducts, Product } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { ImageUpload } from '@/components/Admin/ImageUpload';
import AdminLayout from '@/components/Admin/AdminLayout';

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const { products, createProduct, updateProduct } = useProducts();
  const { categories } = useCategories();
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    original_price: 0,
    discounted_price: 0,
    stock: 0,
    category_id: '',
    images: [],
    tags: [],
    featured: false,
    status: 'active'
  });
  
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (isEditing && id && products.length > 0) {
      const product = products.find(p => p.id === id);
      if (product) {
        setFormData(product);
      }
    }
  }, [isEditing, id, products]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && formData.tags && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        tags: [...(prev.tags || []), newTag.trim()] 
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove) 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.original_price) {
      return;
    }

    try {
      if (isEditing && id) {
        await updateProduct.mutateAsync({ ...formData, id } as Product & { id: string });
      } else {
        await createProduct.mutateAsync(formData as Omit<Product, 'id' | 'created_at' | 'updated_at'>);
      }
      navigate('/admin/products');
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
            onClick={() => navigate('/admin/products')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Modifier le produit' : 'Ajouter un produit'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isEditing ? 'Modifiez les informations du produit' : 'Créez un nouveau produit'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nom du produit"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Description du produit"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select 
                    value={formData.category_id || ''} 
                    onValueChange={(value) => handleInputChange('category_id', value)}
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
                      type="number"
                      value={formData.original_price || 0}
                      onChange={(e) => handleInputChange('original_price', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="discounted_price">Prix promotionnel (FC)</Label>
                    <Input
                      id="discounted_price"
                      type="number"
                      value={formData.discounted_price || 0}
                      onChange={(e) => handleInputChange('discounted_price', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="stock">Stock disponible</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock || 0}
                    onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured || false}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                  <Label htmlFor="featured">Produit vedette</Label>
                </div>

                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select 
                    value={formData.status || 'active'} 
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Images et tags */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Images du produit</CardTitle>
                <CardDescription>
                  Ajoutez des images pour présenter votre produit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  images={formData.images || []}
                  onImagesChange={handleImagesChange}
                  label=""
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags et métadonnées</CardTitle>
                <CardDescription>
                  Mots-clés pour améliorer la recherche
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Ajouter des tags</Label>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Nouveau tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" onClick={handleAddTag} size="sm">
                      Ajouter
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {(formData.tags || []).map((tag, index) => (
                      <div key={index} className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                        {tag}
                        <Button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-red-200 hover:text-red-800 rounded-full"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/products')}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={createProduct.isPending || updateProduct.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {createProduct.isPending || updateProduct.isPending 
                ? (isEditing ? 'Mise à jour...' : 'Création...') 
                : (isEditing ? 'Mettre à jour' : 'Créer le produit')
              }
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
