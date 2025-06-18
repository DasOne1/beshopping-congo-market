
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ProductBasicInfoFormProps {
  formData: {
    name: string;
    description: string;
    sku: string;
    weight: string;
  };
  onChange: (field: string, value: string) => void;
}

const ProductBasicInfoForm = ({ formData, onChange }: ProductBasicInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => onChange('sku', e.target.value)}
            placeholder="CODE-PRODUIT"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="weight">Poids (kg)</Label>
        <Input
          id="weight"
          type="number"
          step="0.001"
          value={formData.weight}
          onChange={(e) => onChange('weight', e.target.value)}
        />
      </div>
    </div>
  );
};

export default ProductBasicInfoForm;
