
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, Plus, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProducts } from '@/hooks/useProducts';
import ProductDetailDialog from './ProductDetailDialog';
import ProductDialog from './ProductDialog';

interface ProductsSectionProps {
  searchTerm: string;
}

const ProductsSection = ({ searchTerm }: ProductsSectionProps) => {
  const navigate = useNavigate();
  const { products, isLoading, deleteProduct } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await deleteProduct.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Produits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Chargement des produits...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5" />
            Produits ({filteredProducts.length})
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => setShowCreateDialog(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Nouveau produit (Dialog)</span>
              <span className="sm:hidden">Dialog</span>
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/catalog/products/new')} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Nouveau produit (Page)</span>
              <span className="sm:hidden">Page</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun produit trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Produit</TableHead>
                    <TableHead className="min-w-[100px]">SKU</TableHead>
                    <TableHead className="min-w-[120px]">Prix</TableHead>
                    <TableHead className="min-w-[80px]">Stock</TableHead>
                    <TableHead className="min-w-[150px]">Caractéristiques</TableHead>
                    <TableHead className="min-w-[100px]">Statut</TableHead>
                    <TableHead className="min-w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-medium truncate">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {product.brand && <span className="mr-2">🏷️ {product.brand}</span>}
                              {product.gender && <span>👤 {product.gender}</span>}
                            </div>
                            {product.featured && (
                              <Badge variant="secondary" className="text-xs mt-1">
                                Vedette
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.sku || '-'}</TableCell>
                      <TableCell>
                        <div>
                          {product.discounted_price ? (
                            <>
                              <span className="font-medium">
                                {product.discounted_price.toLocaleString()} CDF
                              </span>
                              <div className="text-sm text-muted-foreground line-through">
                                {product.original_price.toLocaleString()} CDF
                              </div>
                            </>
                          ) : (
                            <span className="font-medium">
                              {product.original_price.toLocaleString()} CDF
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                          {product.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {product.colors && product.colors.length > 0 && (
                            <div className="text-xs">
                              🎨 {product.colors.slice(0, 3).join(', ')}
                              {product.colors.length > 3 && '...'}
                            </div>
                          )}
                          {product.sizes && product.sizes.length > 0 && (
                            <div className="text-xs">
                              📏 {product.sizes.slice(0, 3).join(', ')}
                              {product.sizes.length > 3 && '...'}
                            </div>
                          )}
                          {product.material && (
                            <div className="text-xs">
                              🧵 {product.material}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            product.status === 'active' ? 'default' :
                            product.status === 'inactive' ? 'secondary' : 'outline'
                          }
                        >
                          {product.status === 'active' ? 'Actif' :
                           product.status === 'inactive' ? 'Inactif' : 'Brouillon'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowDetailDialog(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowEditDialog(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedProduct && (
        <ProductDetailDialog
          product={selectedProduct}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
        />
      )}

      {selectedProduct && (
        <ProductDialog
          product={selectedProduct}
          open={showEditDialog}
          onOpenChange={(open) => {
            setShowEditDialog(open);
            if (!open) setSelectedProduct(null);
          }}
        />
      )}

      <ProductDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

export default ProductsSection;
