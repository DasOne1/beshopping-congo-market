
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
  className?: string;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  images,
  productName,
  className = ""
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`aspect-square bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-400">Aucune image</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className={`aspect-square overflow-hidden rounded-lg ${className}`}>
        <img
          src={images[0]}
          alt={productName}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Image principale */}
      <div className="relative aspect-square overflow-hidden rounded-lg group">
        <img
          src={images[currentImageIndex]}
          alt={`${productName} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Boutons de navigation */}
        <Button
          variant="ghost"
          size="sm"
          onClick={previousImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Indicateur de position */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Miniatures */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
              index === currentImageIndex 
                ? 'border-primary' 
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <img
              src={image}
              alt={`${productName} - Miniature ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageCarousel;
