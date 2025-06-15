
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProductPricingFormProps {
  formData: {
    original_price: string;
    discount: string;
    stock: string;
  };
  onChange: (field: string, value: string) => void;
}

const ProductPricingForm = ({ formData, onChange }: ProductPricingFormProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="price">Prix *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.original_price}
          onChange={(e) => onChange('original_price', e.target.value)}
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
          onChange={(e) => onChange('discount', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="stock">Stock *</Label>
        <Input
          id="stock"
          type="number"
          min="0"
          value={formData.stock}
          onChange={(e) => onChange('stock', e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default ProductPricingForm;
