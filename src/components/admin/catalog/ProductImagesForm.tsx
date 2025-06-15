
import React from 'react';
import { Label } from '@/components/ui/label';
import ImageUpload from '@/components/ImageUpload';

interface ProductImagesFormProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const ProductImagesForm = ({ images, onChange }: ProductImagesFormProps) => {
  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    onChange(newImages);
  };

  const handleImageRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <Label>Images</Label>
      <div className="grid grid-cols-2 gap-4">
        {images.slice(0, 2).map((image, index) => (
          <ImageUpload
            key={index}
            value={image}
            onChange={(value) => handleImageChange(index, value)}
            onRemove={() => handleImageRemove(index)}
            maxSize={2}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImagesForm;
