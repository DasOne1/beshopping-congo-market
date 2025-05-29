
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  accept?: string;
}

// Function to compress and resize images
const compressImage = (file: File, maxWidth: number = 800, maxHeight: number = 600, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = document.createElement('img');
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        }
      }, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  multiple = false,
  accept = "image/*"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      const processedFiles: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Compress the image
        const compressedFile = await compressImage(file);
        
        // Convert to base64
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(compressedFile);
        });
        
        const base64 = await base64Promise;
        processedFiles.push(base64);
      }

      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        onChange([...currentValues, ...processedFiles]);
      } else {
        onChange(processedFiles[0]);
      }

      toast({
        title: "Images uploadées",
        description: `${processedFiles.length} image(s) compressée(s) et uploadée(s) avec succès`,
      });
    } catch (error) {
      console.error('Error processing images:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du traitement des images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    if (multiple && Array.isArray(value)) {
      const newValue = value.filter((_, index) => index !== indexToRemove);
      onChange(newValue);
    } else {
      onChange('');
    }
  };

  const currentImages = multiple ? (Array.isArray(value) ? value : []) : (value ? [value] : []);

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      <div className="flex items-center gap-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {isUploading ? 'Upload en cours...' : 'Choisir image(s)'}
        </Button>
      </div>

      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentImages.map((img, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                {img ? (
                  <img
                    src={img}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
