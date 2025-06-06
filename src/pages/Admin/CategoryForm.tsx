import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Category } from '@/types';

interface CategoryFormProps {
  category?: Category | null;
  categories: Category[];
  onSave: (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image: category?.image || '',
    parent_id: category?.parent_id || '',
    is_visible: category?.is_visible ?? true
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || '',
        image: category.image || '',
        parent_id: category.parent_id || '',
        is_visible: category.is_visible
      });
    } else {
      // Reset form data when creating a new category
      setFormData({
        name: '',
        slug: '',
        description: '',
        image: '',
        parent_id: '',
        is_visible: true
      });
    }
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleParentCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, parent_id: value }));
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
  };

  useEffect(() => {
    if (!formData.slug) {
      setFormData(prev => ({ ...prev, slug: generateSlug(formData.name) }));
    }
  }, [formData.name]);

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

    onSave({
      ...formData,
      parent_id: formData.parent_id || null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label htmlFor="slug">Slug</Label>
        <Input
          type="text"
          id="slug"
          value={formData.slug}
          onChange={handleChange}
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

      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          type="text"
          id="image"
          value={formData.image}
          onChange={handleChange}
        />
      </div>

      <div>
        <Label htmlFor="parent_id">Catégorie parente</Label>
        <Select onValueChange={handleParentCategoryChange} defaultValue={formData.parent_id}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionner une catégorie parente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Aucune catégorie parente</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="is_visible"
          checked={formData.is_visible}
          onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
        />
        <Label htmlFor="is_visible">Visible publiquement</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {category ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
