
import React, { useState, useRef } from 'react';
import { Upload, X, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
}

export function ImageUpload({ images, onImagesChange, maxImages = 5, label = "Images" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length && (images.length + newImages.length) < maxImages; i++) {
        const file = files[i];
        
        // Convert file to base64 for now (in a real app, you'd upload to a service)
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            if (reader.result && typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to read file'));
            }
          };
          reader.onerror = reject;
        });
        
        reader.readAsDataURL(file);
        const base64 = await base64Promise;
        newImages.push(base64);
      }

      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleManualUrlAdd = () => {
    if (manualUrl.trim() && images.length < maxImages) {
      onImagesChange([...images, manualUrl.trim()]);
      setManualUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{label}</Label>
      
      {/* Upload Methods */}
      <div className="space-y-3">
        {/* File Upload */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading || images.length >= maxImages}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || images.length >= maxImages}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? 'Upload en cours...' : 'Télécharger des images'}
          </Button>
        </div>

        {/* Manual URL */}
        <div className="flex gap-2">
          <Input
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="Ou coller une URL d'image"
            disabled={images.length >= maxImages}
          />
          <Button
            type="button"
            onClick={handleManualUrlAdd}
            disabled={!manualUrl.trim() || images.length >= maxImages}
            size="sm"
          >
            Ajouter
          </Button>
        </div>
      </div>

      {/* Images Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-800">
                {image.startsWith('data:') || image.startsWith('http') ? (
                  <img 
                    src={image} 
                    alt={`Image ${index + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                      const errorDiv = document.createElement('div');
                      errorDiv.innerHTML = '<div class="text-gray-400 text-center"><svg class="w-6 h-6 mx-auto mb-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" /></svg><p class="text-xs">Erreur</p></div>';
                      target.parentElement?.appendChild(errorDiv);
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Image className="w-8 h-8" />
                  </div>
                )}
              </div>
              <Button
                type="button"
                onClick={() => handleRemoveImage(index)}
                size="sm"
                variant="destructive"
                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {images.length}/{maxImages} images • Formats acceptés: JPG, PNG, GIF
      </p>
    </div>
  );
}
