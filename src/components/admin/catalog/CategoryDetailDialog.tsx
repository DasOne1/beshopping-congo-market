
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProducts } from '@/hooks/useProducts';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Package, Eye, EyeOff } from 'lucide-react';

interface CategoryDetailDialogProps {
  category?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CategoryDetailDialog = ({ category, open, onOpenChange }: CategoryDetailDialogProps) => {
  const { products } = useProducts();
  
  const categoryProducts = products?.filter(product => product.category_id === category?.id) || [];

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {category.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Category Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations de la catégorie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.image && (
                <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nom</p>
                  <p className="text-base">{category.name}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Statut</p>
                  <div className="flex items-center gap-2">
                    {category.is_visible ? (
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
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <Badge variant={category.parent_id ? "secondary" : "default"}>
                    {category.parent_id ? "Sous-catégorie" : "Catégorie principale"}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Créée le</p>
                  <p className="text-base">{formatDate(category.created_at)}</p>
                </div>
              </div>
              
              {category.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <p className="text-base">{category.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products in Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Produits dans cette catégorie ({categoryProducts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoryProducts.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Aucun produit dans cette catégorie
                </p>
              ) : (
                <div className="space-y-4">
                  {categoryProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-3 border rounded-lg">
                      {product.images?.[0] && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{product.name}</h4>
                        <p className="text-sm text-gray-500">
                          Stock: {product.stock} • {formatCurrency(product.original_price)}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                          {product.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                        {product.is_visible ? (
                          <Eye className="h-4 w-4 text-green-500" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
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

export default CategoryDetailDialog;
