
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, Plus, Package, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProducts } from '@/hooks/useProducts';
import ProductDetailDialog from './ProductDetailDialog';
import { Switch } from '@/components/ui/switch';

interface ProductsSectionProps {
  searchTerm: string;
}

const ProductsSection = ({ searchTerm }: ProductsSectionProps) => {
  const navigate = useNavigate();
  const { products, isLoading, deleteProduct, updateProduct } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  // Séparer les produits visibles et masqués
  const visibleProducts = products?.filter(product => 
    product.is_visible && 
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.brand?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const hiddenProducts = products?.filter(product => 
    !product.is_visible && 
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     product.brand?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await deleteProduct.mutateAsync(id);
    }
  };

  const handleVisibilityToggle = async (id: string, currentVisibility: boolean) => {
    await updateProduct.mutateAsync({ 
      id, 
      is_visible: !currentVisibility 
    });
  };

  const renderProductTable = (productList: any[], showVisibilityToggle = true) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produit</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Caractéristiques</TableHead>
            <TableHead>Statut</TableHead>
            {showVisibilityToggle && <TableHead>Visibilité</TableHead>}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productList.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  {product.images?.[0] && (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                  )}
                  <div>
                    <div className="font-medium">{product.name}</div>
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
                      <span className="text-sm text-muted-foreground line-through ml-2">
                        {product.original_price.toLocaleString()} CDF
                      </span>
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
              {showVisibilityToggle && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={product.is_visible}
                      onCheckedChange={() => handleVisibilityToggle(product.id, product.is_visible)}
                    />
                    {product.is_visible ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </TableCell>
              )}
              <TableCell>
                <div className="flex items-center gap-2">
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
                    onClick={() => navigate(`/admin/catalog/products/${product.id}/edit`)}
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
  );

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
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Gestion des Produits
          </CardTitle>
          <Button onClick={() => navigate('/admin/catalog/products/new')} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau produit
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="visible" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="visible">Produits Visibles ({visibleProducts.length})</TabsTrigger>
              <TabsTrigger value="hidden">Produits Masqués ({hiddenProducts.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="visible" className="mt-6">
              {visibleProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun produit visible trouvé
                </div>
              ) : (
                renderProductTable(visibleProducts, true)
              )}
            </TabsContent>
            
            <TabsContent value="hidden" className="mt-6">
              {hiddenProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun produit masqué trouvé
                </div>
              ) : (
                renderProductTable(hiddenProducts, true)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {selectedProduct && (
        <ProductDetailDialog
          product={selectedProduct}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
        />
      )}
    </>
  );
};

export default ProductsSection;
