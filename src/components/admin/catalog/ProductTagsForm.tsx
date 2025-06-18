
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProductTagsFormProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

const ProductTagsForm = ({ tags, onChange }: ProductTagsFormProps) => {
  const handleTagsInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      const values = input.value.split(',').map(v => v.trim()).filter(v => v);
      if (values.length > 0) {
        onChange([...new Set([...tags.filter(t => t), ...values])]);
        input.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label>Tags</Label>
      <Input
        placeholder="Ajouter des tags séparés par des virgules"
        onKeyDown={handleTagsInput}
      />
    </div>
  );
};

export default ProductTagsForm;
