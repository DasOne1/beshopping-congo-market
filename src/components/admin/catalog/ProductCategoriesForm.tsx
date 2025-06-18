
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import { useSubcategories } from '@/hooks/useSubcategories';

interface ProductCategoriesFormProps {
  formData: {
    category_id: string;
    subcategory_id: string;
  };
  onChange: (field: string, value: string) => void;
  onCategoryChange: (categoryId: string) => void;
}

const ProductCategoriesForm = ({ formData, onChange, onCategoryChange }: ProductCategoriesFormProps) => {
  const { categories } = useCategories();
  const { subcategories } = useSubcategories(formData.category_id);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select
          value={formData.category_id}
          onValueChange={onCategoryChange}
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
          onValueChange={(value) => onChange('subcategory_id', value)}
          disabled={!formData.category_id}
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
  );
};

export default ProductCategoriesForm;
