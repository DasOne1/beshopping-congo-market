
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/types';

interface ProductAttributesProps {
  product: Product;
  className?: string;
}

const ProductAttributes = ({ product, className = '' }: ProductAttributesProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
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

      {/* Couleurs disponibles */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <span className="text-sm font-medium text-muted-foreground block mb-2">Couleurs disponibles:</span>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {color}
              </Badge>
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
              <Badge key={index} variant="secondary" className="text-xs">
                {size}
              </Badge>
            ))}
          </div>
        </div>
      )}

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
