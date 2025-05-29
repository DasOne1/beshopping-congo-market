
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

// Configuration pour l'optimisation des images
const IMAGE_CONFIG = {
  maxWidth: 800,
  maxHeight: 600,
  quality: 0.8,
  maxSizeKB: 500, // Taille maximale en KB
};

export function ImageUpload({ images, onImagesChange, maxImages = 5, label = "Images" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculer les nouvelles dimensions en gardant le ratio
        let { width, height } = img;
        const maxWidth = IMAGE_CONFIG.maxWidth;
        const maxHeight = IMAGE_CONFIG.maxHeight;

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

        // Dessiner l'image redimensionnée
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir en base64 avec compression
        let quality = IMAGE_CONFIG.quality;
        let result = canvas.toDataURL('image/jpeg', quality);

        // Réduire la qualité si l'image est encore trop lourde
        while (result.length > IMAGE_CONFIG.maxSizeKB * 1024 * 1.37 && quality > 0.1) {
          quality -= 0.1;
          result = canvas.toDataURL('image/jpeg', quality);
        }

        console.log(`Image optimisée: ${Math.round(result.length / 1024)} KB (qualité: ${Math.round(quality * 100)}%)`);
        resolve(result);
      };

      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length && (images.length + newImages.length) < maxImages; i++) {
        const file = files[i];
        
        // Vérifier le type de fichier
        if (!file.type.startsWith('image/')) {
          console.warn(`Fichier ignoré (pas une image): ${file.name}`);
          continue;
        }

        // Vérifier la taille du fichier original
        const originalSizeMB = file.size / (1024 * 1024);
        if (originalSizeMB > 10) {
          console.warn(`Fichier trop volumineux ignoré: ${file.name} (${originalSizeMB.toFixed(1)}MB)`);
          continue;
        }

        console.log(`Compression de l'image: ${file.name} (${originalSizeMB.toFixed(1)}MB)`);
        
        try {
          const compressedImage = await compressImage(file);
          newImages.push(compressedImage);
        } catch (error) {
          console.error(`Erreur lors de la compression de ${file.name}:`, error);
        }
      }

      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error('Erreur lors du traitement des images:', error);
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
            {uploading ? 'Compression en cours...' : 'Télécharger des images'}
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
      <div className="space-y-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {images.length}/{maxImages} images • Auto-compression activée
        </p>
        <p className="text-xs text-gray-400">
          Les images sont automatiquement redimensionnées (max {IMAGE_CONFIG.maxWidth}x{IMAGE_CONFIG.maxHeight}px) 
          et compressées (max {IMAGE_CONFIG.maxSizeKB}KB) pour optimiser les performances
        </p>
      </div>
    </div>
  );
}
