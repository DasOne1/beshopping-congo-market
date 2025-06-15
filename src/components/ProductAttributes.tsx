
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/types';

interface ProductAttributesProps {
  product: Product;
}

const ProductAttributes = ({ product }: ProductAttributesProps) => {
  const hasAttributes = product.colors?.length || product.sizes?.length || product.tags?.length || 
    product.gender || product.material || product.brand || product.collection || product.season || 
    product.care_instructions || product.sku || product.weight;

  if (!hasAttributes) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Détails du produit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informations générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.sku && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">SKU</p>
              <p className="text-sm">{product.sku}</p>
            </div>
          )}
          
          {product.brand && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Marque</p>
              <p className="text-sm">{product.brand}</p>
            </div>
          )}
          
          {product.gender && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Genre</p>
              <p className="text-sm capitalize">{product.gender}</p>
            </div>
          )}
          
          {product.material && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Matériau</p>
              <p className="text-sm">{product.material}</p>
            </div>
          )}
          
          {product.collection && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Collection</p>
              <p className="text-sm">{product.collection}</p>
            </div>
          )}
          
          {product.season && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Saison</p>
              <p className="text-sm capitalize">{product.season}</p>
            </div>
          )}
          
          {product.weight && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Poids</p>
              <p className="text-sm">{product.weight} kg</p>
            </div>
          )}
        </div>

        {/* Couleurs */}
        {product.colors && product.colors.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Couleurs disponibles</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {color}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tailles */}
        {product.sizes && product.sizes.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Tailles disponibles</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Instructions d'entretien */}
        {product.care_instructions && (
          <>
            <Separator />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Instructions d'entretien</p>
              <p className="text-sm text-muted-foreground">{product.care_instructions}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductAttributes;
