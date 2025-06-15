
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

interface ColorSelectorProps {
  colors: string[];
  onChange: (colors: string[]) => void;
}

const predefinedColors = [
  { name: 'Rouge', value: '#FF0000' },
  { name: 'Bleu', value: '#0000FF' },
  { name: 'Vert', value: '#008000' },
  { name: 'Noir', value: '#000000' },
  { name: 'Blanc', value: '#FFFFFF' },
  { name: 'Gris', value: '#808080' },
  { name: 'Jaune', value: '#FFFF00' },
  { name: 'Rose', value: '#FFC0CB' },
  { name: 'Violet', value: '#800080' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Marron', value: '#A52A2A' },
  { name: 'Beige', value: '#F5F5DC' },
];

const ColorSelector = ({ colors, onChange }: ColorSelectorProps) => {
  const [customColor, setCustomColor] = useState('');

  const addColor = (colorName: string) => {
    if (!colors.includes(colorName)) {
      onChange([...colors, colorName]);
    }
  };

  const removeColor = (colorToRemove: string) => {
    onChange(colors.filter(color => color !== colorToRemove));
  };

  const addCustomColor = () => {
    if (customColor.trim() && !colors.includes(customColor.trim())) {
      onChange([...colors, customColor.trim()]);
      setCustomColor('');
    }
  };

  return (
    <div className="space-y-4">
      <Label>Couleurs disponibles</Label>
      
      {/* Couleurs sélectionnées */}
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <Badge key={color} variant="secondary" className="flex items-center gap-1">
            {color}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => removeColor(color)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      {/* Couleurs prédéfinies */}
      <div>
        <Label className="text-sm text-gray-600">Couleurs prédéfinies</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {predefinedColors.map((color) => (
            <Button
              key={color.name}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addColor(color.name)}
              disabled={colors.includes(color.name)}
              className="flex items-center gap-2 justify-start"
            >
              <div 
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color.value }}
              />
              {color.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Couleur personnalisée */}
      <div className="flex gap-2">
        <Input
          placeholder="Couleur personnalisée"
          value={customColor}
          onChange={(e) => setCustomColor(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addCustomColor();
            }
          }}
        />
        <Button type="button" onClick={addCustomColor} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ColorSelector;
