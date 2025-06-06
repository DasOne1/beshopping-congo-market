import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from '@/components/ui/use-toast';
import { Product, Category } from '@/types';
import ImageUpload from '@/components/Admin/ImageUpload';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
  onSave: (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    original_price: product?.original_price || 0,
    discounted_price: product?.discounted_price || undefined,
    stock: product?.stock || 0,
    category_id: product?.category_id || 'none',
    images: product?.images || [],
    tags: product?.tags || [],
    featured: product?.featured || false,
    is_visible: product?.is_visible ?? true,
    status: product?.status || 'active' as const
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        original_price: product.original_price,
        discounted_price: product.discounted_price,
        stock: product.stock,
        category_id: product.category_id,
        images: product.images,
        tags: product.tags,
        featured: product.featured,
        is_visible: product.is_visible,
        status: product.status
      });
    } else {
      setFormData({
        name: '',
        description: '',
        original_price: 0,
        discounted_price: undefined,
        stock: 0,
        category_id: 'none',
        images: [],
        tags: [],
        featured: false,
        is_visible: true,
        status: 'active'
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom est requis",
        variant: "destructive",
      });
      return;
    }

    const dataToSave = {
      ...formData,
      category_id: formData.category_id === 'none' ? '' : formData.category_id,
      discount: formData.discounted_price ? 
        Math.round(((formData.original_price - formData.discounted_price) / formData.original_price) * 100) : 0,
      popular: formData.featured ? 1 : 0
    };

    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Nom *</Label>
        <Input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="original_price">Prix original *</Label>
          <Input
            type="number"
            id="original_price"
            value={formData.original_price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <Label htmlFor="discounted_price">Prix remisé</Label>
          <Input
            type="number"
            id="discounted_price"
            value={formData.discounted_price || ''}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            type="number"
            id="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div>
          <Label htmlFor="category_id">Catégorie</Label>
          <Select 
            onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
            value={formData.category_id || 'none'}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Aucune catégorie</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Images du produit</Label>
        <ImageUpload
          label=""
          images={formData.images}
          onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
          maxImages={5}
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <div className="space-y-2">
          <Input
            id="tags"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Appuyez sur Entrée pour ajouter un tag"
          />
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
        />
        <Label htmlFor="featured">Produit en vedette</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_visible"
          checked={formData.is_visible}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_visible: checked }))}
        />
        <Label htmlFor="is_visible">Visible publiquement</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {product ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
