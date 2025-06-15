
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

interface SizeSelectorProps {
  sizes: string[];
  onChange: (sizes: string[]) => void;
}

const predefinedSizes = {
  vetements: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  chaussures: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
  enfants: ['6 mois', '12 mois', '18 mois', '2 ans', '3 ans', '4 ans', '5 ans', '6 ans', '8 ans', '10 ans', '12 ans', '14 ans'],
};

const SizeSelector = ({ sizes, onChange }: SizeSelectorProps) => {
  const [customSize, setCustomSize] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof predefinedSizes>('vetements');

  const addSize = (sizeName: string) => {
    if (!sizes.includes(sizeName)) {
      onChange([...sizes, sizeName]);
    }
  };

  const removeSize = (sizeToRemove: string) => {
    onChange(sizes.filter(size => size !== sizeToRemove));
  };

  const addCustomSize = () => {
    if (customSize.trim() && !sizes.includes(customSize.trim())) {
      onChange([...sizes, customSize.trim()]);
      setCustomSize('');
    }
  };

  return (
    <div className="space-y-4">
      <Label>Tailles disponibles</Label>
      
      {/* Tailles sélectionnées */}
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Badge key={size} variant="secondary" className="flex items-center gap-1">
            {size}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => removeSize(size)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      {/* Catégories de tailles */}
      <div>
        <Label className="text-sm text-gray-600">Catégories de tailles</Label>
        <div className="flex gap-2 mt-2 mb-3">
          {Object.keys(predefinedSizes).map((category) => (
            <Button
              key={category}
              type="button"
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category as keyof typeof predefinedSizes)}
            >
              {category === 'vetements' && 'Vêtements'}
              {category === 'chaussures' && 'Chaussures'}
              {category === 'enfants' && 'Enfants'}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {predefinedSizes[selectedCategory].map((size) => (
            <Button
              key={size}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addSize(size)}
              disabled={sizes.includes(size)}
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Taille personnalisée */}
      <div className="flex gap-2">
        <Input
          placeholder="Taille personnalisée"
          value={customSize}
          onChange={(e) => setCustomSize(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustomSize();
            }
          }}
        />
        <Button type="button" onClick={addCustomSize} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SizeSelector;
