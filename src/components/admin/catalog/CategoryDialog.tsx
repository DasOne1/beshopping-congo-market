
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCategories } from '@/hooks/useCategories';
import ImageUpload from '@/components/ImageUpload';

interface CategoryDialogProps {
  category?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CategoryDialog = ({ category, open, onOpenChange }: CategoryDialogProps) => {
  const { categories, createCategory, updateCategory } = useCategories();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    parent_id: '',
    is_visible: true
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: category.image || '',
        parent_id: category.parent_id || '',
        is_visible: category.is_visible ?? true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        image: '',
        parent_id: '',
        is_visible: true
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const categoryData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        parent_id: formData.parent_id === 'none' ? null : formData.parent_id
      };

      if (category) {
        await updateCategory.mutateAsync({ id: category.id, ...categoryData });
      } else {
        await createCategory.mutateAsync(categoryData);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const parentCategories = categories?.filter(cat => !cat.parent_id) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="parent">Catégorie parent</Label>
              <Select
                value={formData.parent_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, parent_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Aucune (catégorie principale)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucune (catégorie principale)</SelectItem>
                  {parentCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          
          <div className="space-y-2">
            <Label>Image</Label>
            <ImageUpload
              value={formData.image}
              onChange={(value) => setFormData(prev => ({ ...prev, image: value }))}
              onRemove={() => setFormData(prev => ({ ...prev, image: '' }))}
              maxSize={2}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="visible">Visible</Label>
            <Switch
              id="visible"
              checked={formData.is_visible}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_visible: checked }))}
            />
          </div>
          
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {category ? 'Modification...' : 'Création...'}
                </div>
              ) : (
                category ? 'Modifier' : 'Créer'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
