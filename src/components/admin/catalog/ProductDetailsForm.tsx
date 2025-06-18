
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ColorSelector from './ColorSelector';
import SizeSelector from './SizeSelector';

interface ProductDetailsFormProps {
  formData: {
    gender: 'homme' | 'femme' | 'mixte' | '';
    brand: string;
    material: string;
    collection: string;
    season: string;
    care_instructions: string;
    colors: string[];
    sizes: string[];
  };
  onChange: (field: string, value: any) => void;
}

const ProductDetailsForm = ({ formData, onChange }: ProductDetailsFormProps) => {
  return (
    <div className="space-y-6">
      {/* Informations produit */}
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender">Genre</Label>
          <Select
            value={formData.gender}
            onValueChange={(value: 'homme' | 'femme' | 'mixte') => onChange('gender', value)}
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
            onChange={(e) => onChange('brand', e.target.value)}
            placeholder="Nom de la marque"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="material">Matériau</Label>
          <Input
            id="material"
            value={formData.material}
            onChange={(e) => onChange('material', e.target.value)}
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
            onChange={(e) => onChange('collection', e.target.value)}
            placeholder="Collection 2024"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="season">Saison</Label>
          <Select
            value={formData.season}
            onValueChange={(value) => onChange('season', value)}
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
        onChange={(colors) => onChange('colors', colors)}
      />

      {/* Tailles */}
      <SizeSelector
        sizes={formData.sizes}
        onChange={(sizes) => onChange('sizes', sizes)}
      />

      {/* Instructions d'entretien */}
      <div className="space-y-2">
        <Label htmlFor="care_instructions">Instructions d'entretien</Label>
        <Textarea
          id="care_instructions"
          value={formData.care_instructions}
          onChange={(e) => onChange('care_instructions', e.target.value)}
          placeholder="Lavage à 30°C, ne pas repasser, etc."
          rows={2}
        />
      </div>
    </div>
  );
};

export default ProductDetailsForm;
