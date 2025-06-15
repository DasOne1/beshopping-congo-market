
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useSubcategories } from '@/hooks/useSubcategories';
import ImageUpload from '@/components/ImageUpload';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';
import { Product } from '@/types';

interface ProductDialogProps {
  product?: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductDialog = ({ product, open, onOpenChange }: ProductDialogProps) => {
  const { createProduct, updateProduct } = useProducts();
  const { categories } = useCategories();
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

  useEffect(() => {
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
    } else {
      setFormData({
        name: '',
        description: '',
        original_price: '',
        discount: '',
        stock: '',
        category_id: '',
        subcategory_id: '',
        sku: '',
        weight: '',
        status: 'active',
        is_visible: true,
        featured: false,
        images: [''],
        tags: [''],
        colors: [],
        sizes: [],
        gender: '',
        material: '',
        brand: '',
        collection: '',
        season: '',
        care_instructions: '',
      });
      setSelectedCategoryId('');
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    if (product) {
      await updateProduct.mutateAsync({ id: product.id, ...productData });
    } else {
      await createProduct.mutateAsync(productData);
    }
    
    onOpenChange(false);
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({ ...prev, category_id: categoryId, subcategory_id: '' }));
    setSelectedCategoryId(categoryId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Modifier le produit' : 'Nouveau produit'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="CODE-PRODUIT"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Prix et Stock */}
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.original_price}
                onChange={(e) => setFormData(prev => ({ ...prev, original_price: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discount">Remise (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Poids (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.001"
                value={formData.weight}
                onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
              />
            </div>
          </div>

          {/* Catégories */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={formData.category_id}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
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
            
            <div className="space-y-2">
              <Label htmlFor="subcategory">Sous-catégorie</Label>
              <Select
                value={formData.subcategory_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, subcategory_id: value }))}
                disabled={!selectedCategoryId}
              >
                <SelectTrigger>
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
          </div>

          {/* Informations produit */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Genre</Label>
              <Select
                value={formData.gender}
                onValueChange={(value: 'homme' | 'femme' | 'mixte') => setFormData(prev => ({ ...prev, gender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homme">Homme</SelectItem>
                  <SelectItem value="femme">Femme</SelectItem>
                  <SelectItem value="mixte">Mixte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Marque</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                placeholder="Nom de la marque"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="material">Matériau</Label>
              <Input
                id="material"
                value={formData.material}
                onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                placeholder="Coton, Polyester, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="collection">Collection</Label>
              <Input
                id="collection"
                value={formData.collection}
                onChange={(e) => setFormData(prev => ({ ...prev, collection: e.target.value }))}
                placeholder="Collection 2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="season">Saison</Label>
              <Select
                value={formData.season}
                onValueChange={(value) => setFormData(prev => ({ ...prev, season: value }))}
              >
                <SelectTrigger>
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

          {/* Couleurs */}
          <ColorSelector
            colors={formData.colors}
            onChange={(colors) => setFormData(prev => ({ ...prev, colors }))}
          />

          {/* Tailles */}
          <SizeSelector
            sizes={formData.sizes}
            onChange={(sizes) => setFormData(prev => ({ ...prev, sizes }))}
          />

          {/* Instructions d'entretien */}
          <div className="space-y-2">
            <Label htmlFor="care_instructions">Instructions d'entretien</Label>
            <Textarea
              id="care_instructions"
              value={formData.care_instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, care_instructions: e.target.value }))}
              placeholder="Lavage à 30°C, ne pas repasser, etc."
              rows={2}
            />
          </div>

          {/* Images - section simplifiée */}
          <div className="space-y-4">
            <Label>Images</Label>
            <div className="grid grid-cols-2 gap-4">
              {formData.images.slice(0, 2).map((image, index) => (
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
          </div>

          {/* Tags simplifiés */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <Input
              placeholder="Ajouter des tags séparés par des virgules"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  const values = input.value.split(',').map(v => v.trim()).filter(v => v);
                  if (values.length > 0) {
                    setFormData(prev => ({
                      ...prev,
                      tags: [...new Set([...prev.tags.filter(t => t), ...values])]
                    }));
                    input.value = '';
                  }
                }
              }}
            />
          </div>

          {/* Statut et visibilité */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive' | 'draft') => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Switches */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="visible">Visible</Label>
              <Switch
                id="visible"
                checked={formData.is_visible}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_visible: checked }))}
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
          </div>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {product ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
