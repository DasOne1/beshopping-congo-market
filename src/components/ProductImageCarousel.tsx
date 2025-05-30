
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
  className?: string;
}

const ProductImageCarousel = ({ images, productName, className = '' }: ProductImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-500">Aucune image</span>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Image principale */}
      <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        <img
          src={images[currentImageIndex]}
          alt={`${productName} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Navigation arrows - seulement si plusieurs images */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Indicateur du nombre d'images */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {currentImageIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* Miniatures - seulement si plusieurs images */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                index === currentImageIndex 
                  ? 'border-blue-500 opacity-100' 
                  : 'border-gray-200 opacity-70 hover:opacity-100'
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
      )}
    </div>
  );
};

export default ProductImageCarousel;
