
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

interface ProductAttributesProps {
  product: Product;
  selectedColor?: string;
  selectedSize?: string;
  onColorChange?: (color: string) => void;
  onSizeChange?: (size: string) => void;
  className?: string;
}

const ProductAttributes = ({ 
  product, 
  selectedColor = '',
  selectedSize = '',
  onColorChange,
  onSizeChange,
  className = '' 
}: ProductAttributesProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Couleurs disponibles */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <span className="text-sm font-medium text-muted-foreground block mb-2">Couleurs disponibles:</span>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color, index) => (
              <Button
                key={index}
                variant={selectedColor === color ? "default" : "outline"}
                size="sm"
                onClick={() => onColorChange?.(color)}
                className="text-xs"
              >
                {color}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Tailles disponibles */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <span className="text-sm font-medium text-muted-foreground block mb-2">Tailles disponibles:</span>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size, index) => (
              <Button
                key={index}
                variant={selectedSize === size ? "default" : "outline"}
                size="sm"
                onClick={() => onSizeChange?.(size)}
                className="text-xs"
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Informations de base */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {product.sku && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">SKU:</span>
            <p className="text-sm">{product.sku}</p>
          </div>
        )}
        
        {product.brand && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Marque:</span>
            <p className="text-sm">{product.brand}</p>
          </div>
        )}
        
        {product.gender && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Genre:</span>
            <p className="text-sm capitalize">{product.gender}</p>
          </div>
        )}
        
        {product.material && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Matériau:</span>
            <p className="text-sm">{product.material}</p>
          </div>
        )}
      </div>

      {/* Collection et saison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {product.collection && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Collection:</span>
            <p className="text-sm">{product.collection}</p>
          </div>
        )}
        
        {product.season && (
          <div>
            <span className="text-sm font-medium text-muted-foreground">Saison:</span>
            <p className="text-sm capitalize">{product.season}</p>
          </div>
        )}
      </div>

      {/* Instructions d'entretien */}
      {product.care_instructions && (
        <div>
          <span className="text-sm font-medium text-muted-foreground block mb-2">Instructions d'entretien:</span>
          <p className="text-sm text-muted-foreground">{product.care_instructions}</p>
        </div>
      )}

      {/* Dimensions et poids */}
      {(product.dimensions || product.weight) && (
        <>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.weight && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Poids:</span>
                <p className="text-sm">{product.weight} g</p>
              </div>
            )}
            
            {product.dimensions && (
              <div>
                <span className="text-sm font-medium text-muted-foreground">Dimensions:</span>
                <p className="text-sm">
                  {typeof product.dimensions === 'object' 
                    ? `${product.dimensions.length || 0} × ${product.dimensions.width || 0} × ${product.dimensions.height || 0} cm`
                    : product.dimensions
                  }
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductAttributes;
