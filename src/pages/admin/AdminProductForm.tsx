import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useSubcategories } from '@/hooks/useSubcategories';
import ImageUpload from '@/components/ImageUpload';
import ColorSelector from '@/components/admin/catalog/ColorSelector';
import SizeSelector from '@/components/admin/catalog/SizeSelector';
import { Product } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { products, createProduct, updateProduct } = useProducts({
    includeHidden: true,
    includeInactive: true
  });
  
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const { subcategories } = useSubcategories(selectedCategoryId);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    original_price: '',
    discount: '',
    stock: '',
    category_id: '',
    subcategory_id: '',
    sku: '',
    weight: '',
    status: 'active' as 'active' | 'inactive' | 'draft',
    is_visible: true,
    featured: false,
    images: [''],
    tags: [''],
    colors: [] as string[],
    sizes: [] as string[],
    gender: '' as 'homme' | 'femme' | 'mixte' | '',
    material: '',
    brand: '',
    collection: '',
    season: '',
    care_instructions: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && products && id) {
      const product = products.find((p: Product) => p.id === id);
      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          original_price: product.original_price?.toString() || '',
          discount: product.discount?.toString() || '',
          stock: product.stock?.toString() || '',
          category_id: product.category_id || '',
          subcategory_id: product.subcategory_id || '',
          sku: product.sku || '',
          weight: product.weight?.toString() || '',
          status: product.status || 'active',
          is_visible: product.is_visible ?? true,
          featured: product.featured ?? false,
          images: product.images?.length ? product.images : [''],
          tags: product.tags?.length ? product.tags : [''],
          colors: product.colors || [],
          sizes: product.sizes || [],
          gender: product.gender || '',
          material: product.material || '',
          brand: product.brand || '',
          collection: product.collection || '',
          season: product.season || '',
          care_instructions: product.care_instructions || '',
        });
        setSelectedCategoryId(product.category_id || '');
      }
    }
  }, [isEdit, products, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Soumission du formulaire produit...');
    setLoading(true);
    try {
      const price = parseFloat(formData.original_price) || 0;
      const discount = parseFloat(formData.discount) || 0;
      const discounted_price = discount > 0 ? price * (1 - discount / 100) : null;
      
      const productData = {
        ...formData,
        original_price: price,
        discount: discount,
        discounted_price,
        stock: parseInt(formData.stock) || 0,
        weight: parseFloat(formData.weight) || null,
        images: formData.images.filter(img => img.trim() !== ''),
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        category_id: formData.category_id || null,
        subcategory_id: formData.subcategory_id || null,
        gender: formData.gender || null,
      };

      console.log('Données du produit:', productData);

      if (isEdit && id) {
        console.log('Mise à jour du produit:', id);
        await updateProduct.mutateAsync({ id, ...productData });
      } else {
        console.log('Création d\'un nouveau produit');
        await createProduct.mutateAsync(productData);
      }
      console.log('Opération réussie, redirection...');
      navigate('/admin/catalog');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags.filter(t => t), tag]
      }));
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({ ...prev, category_id: categoryId, subcategory_id: '' }));
    setSelectedCategoryId(categoryId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/catalog')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
            <h1 className="text-lg sm:text-xl font-semibold">
              {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
            </h1>
          </div>
          <Button type="submit" form="product-form" disabled={loading} className="flex items-center gap-2">
            {loading && <span className="loader mr-2" />}
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 pb-8">
        <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations principales */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de base</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="name">Nom du produit *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                        placeholder="CODE-PRODUIT"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Poids (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.001"
                        value={formData.weight}
                        onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Prix et Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price">Prix *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.original_price}
                        onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount">Remise (%)</Label>
                      <Input
                        id="discount"
                        type="number"
                        min="0"
                        max="100"
                        value={formData.discount}
                        onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock *</Label>
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Caractéristiques du produit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="gender">Genre</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value: 'homme' | 'femme' | 'mixte') => setFormData(prev => ({ ...prev, gender: value }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionner le genre" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="homme">Homme</SelectItem>
                          <SelectItem value="femme">Femme</SelectItem>
                          <SelectItem value="mixte">Mixte</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="brand">Marque</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                        placeholder="Nom de la marque"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="material">Matériau</Label>
                      <Input
                        id="material"
                        value={formData.material}
                        onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                        placeholder="Coton, Polyester, etc."
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="collection">Collection</Label>
                      <Input
                        id="collection"
                        value={formData.collection}
                        onChange={(e) => setFormData(prev => ({ ...prev, collection: e.target.value }))}
                        placeholder="Collection 2024"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="season">Saison</Label>
                      <Select
                        value={formData.season}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, season: value }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Sélectionner la saison" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="printemps">Printemps</SelectItem>
                          <SelectItem value="ete">Été</SelectItem>
                          <SelectItem value="automne">Automne</SelectItem>
                          <SelectItem value="hiver">Hiver</SelectItem>
                          <SelectItem value="toute-saison">Toute saison</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="care_instructions">Instructions d'entretien</Label>
                    <Textarea
                      id="care_instructions"
                      value={formData.care_instructions}
                      onChange={(e) => setFormData(prev => ({ ...prev, care_instructions: e.target.value }))}
                      placeholder="Lavage à 30°C, ne pas repasser, etc."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Couleurs et Tailles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ColorSelector
                    colors={formData.colors}
                    onChange={(colors) => setFormData(prev => ({ ...prev, colors }))}
                  />
                  
                  <SizeSelector
                    sizes={formData.sizes}
                    onChange={(sizes) => setFormData(prev => ({ ...prev, sizes }))}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.images.map((image, index) => (
                      <ImageUpload
                        key={index}
                        value={image}
                        onChange={(value) => {
                          const newImages = [...formData.images];
                          newImages[index] = value;
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }}
                        onRemove={() => {
                          const newImages = formData.images.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, images: newImages }));
                        }}
                        maxSize={2}
                      />
                    ))}
                  </div>
                  {formData.images.length < 4 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData(prev => ({ ...prev, images: [...prev.images, ''] }))}
                      className="mt-4"
                    >
                      Ajouter une image
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Statut</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'active' | 'inactive' | 'draft') => 
                        setFormData(prev => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                        <SelectItem value="draft">Brouillon</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="visible">Visible</Label>
                    <Checkbox
                      id="visible"
                      checked={formData.is_visible}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_visible: checked as boolean }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="featured">Produit vedette</Label>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Catégorie</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subcategory">Sous-catégorie</Label>
                    <Select
                      value={formData.subcategory_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory_id: value }))}
                      disabled={!selectedCategoryId}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner une sous-catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories?.map((subcategory) => (
                          <SelectItem key={subcategory.id} value={subcategory.id}>
                            {subcategory.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      tag && (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => removeTag(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      )
                    ))}
                  </div>
                  <Input
                    placeholder="Ajouter un tag"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.target as HTMLInputElement;
                        const value = input.value.trim();
                        if (value) {
                          addTag(value);
                          input.value = '';
                        }
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
