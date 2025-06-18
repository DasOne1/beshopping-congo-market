
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface ProductStatusFormProps {
  formData: {
    status: 'active' | 'inactive' | 'draft';
    is_visible: boolean;
    featured: boolean;
  };
  onChange: (field: string, value: any) => void;
}

const ProductStatusForm = ({ formData, onChange }: ProductStatusFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select
          value={formData.status}
          onValueChange={(value: 'active' | 'inactive' | 'draft') => onChange('status', value)}
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

      <div className="flex items-center justify-between">
        <Label htmlFor="visible">Visible</Label>
        <Switch
          id="visible"
          checked={formData.is_visible}
          onCheckedChange={(checked) => onChange('is_visible', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="featured">Produit vedette</Label>
        <Switch
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) => onChange('featured', checked)}
        />
      </div>
    </div>
  );
};

export default ProductStatusForm;
