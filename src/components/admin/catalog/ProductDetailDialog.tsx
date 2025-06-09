
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Package, Eye, EyeOff, Star, Calendar } from 'lucide-react';

interface ProductDetailDialogProps {
  product?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductDetailDialog = ({ product, open, onOpenChange }: ProductDetailDialogProps) => {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Product Images */}
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {product.images.map((image: string, index: number) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={image} 
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Product Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations générales</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nom</p>
                    <p className="text-base">{product.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">SKU</p>
                    <p className="text-base">{product.sku || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Prix original</p>
                    <p className="text-base font-semibold">{formatCurrency(product.original_price)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Prix réduit</p>
                    <p className="text-base">
                      {product.discounted_price ? formatCurrency(product.discounted_price) : 'N/A'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Stock</p>
                    <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                      {product.stock} unités
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Statut</p>
                    <Badge variant={
                      product.status === 'active' ? 'default' : 
                      product.status === 'inactive' ? 'destructive' : 'secondary'
                    }>
                      {product.status === 'active' ? 'Actif' : 
                       product.status === 'inactive' ? 'Inactif' : 'Brouillon'}
                    </Badge>
                  </div>
                </div>
                
                {product.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-base">{product.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Détails techniques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Poids</p>
                    <p className="text-base">{product.weight ? `${product.weight} kg` : 'N/A'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Remise</p>
                    <p className="text-base">{product.discount ? `${product.discount}%` : '0%'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Visibilité</p>
                    <div className="flex items-center gap-2">
                      {product.is_visible ? (
                        <>
                          <Eye className="h-4 w-4 text-green-500" />
                          <span className="text-green-600">Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Masqué</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Produit vedette</p>
                    <div className="flex items-center gap-2">
                      {product.featured ? (
                        <>
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-yellow-600">Oui</span>
                        </>
                      ) : (
                        <span className="text-gray-600">Non</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Créé le</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDate(product.created_at)}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Modifié le</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDate(product.updated_at)}</span>
                    </div>
                  </div>
                </div>
                
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
