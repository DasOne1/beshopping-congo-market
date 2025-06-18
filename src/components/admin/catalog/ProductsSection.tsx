
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, Plus, Package, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProducts } from '@/hooks/useProducts';
import ProductDetailDialog from './ProductDetailDialog';
import { Product } from '@/types';

interface ProductsSectionProps {
  searchTerm: string;
}

const ProductsSection = ({ searchTerm }: ProductsSectionProps) => {
  const navigate = useNavigate();
  const { products, isLoading, updateProduct, deleteProduct } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const visibleProducts = filteredProducts.filter(product => product.is_visible);
  const hiddenProducts = filteredProducts.filter(product => !product.is_visible);

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await deleteProduct.mutateAsync(id);
    }
  };
  
  const handleVisibilityToggle = async (id: string, is_visible: boolean) => {
    await updateProduct.mutateAsync({ id, is_visible: !is_visible });
  };

  const ProductTable = ({ products, title }: { products: Product[], title: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {title} ({products.length})
        </CardTitle>
        <Button onClick={() => navigate('/admin/catalog/products/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau produit
        </Button>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun produit trouvé
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produit</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            SKU: {product.sku || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {product.discounted_price ? product.discounted_price : product.original_price} €
                        </div>
                        {product.discounted_price && (
                          <div className="text-sm text-muted-foreground line-through">
                            {product.original_price} €
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                        {product.stock} en stock
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.status === 'active' ? "default" : "secondary"}>
                        {product.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={product.is_visible}
                          onCheckedChange={() => handleVisibilityToggle(product.id, product.is_visible)}
                        />
                        {product.is_visible ? (
                          <Eye className="h-4 w-4 text-green-500" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
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
        )}
      </CardContent>
    </Card>
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
      <Tabs defaultValue="visible" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visible">Produits visibles</TabsTrigger>
          <TabsTrigger value="hidden">Produits masqués</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visible">
          <ProductTable products={visibleProducts} title="Produits visibles" />
        </TabsContent>
        
        <TabsContent value="hidden">
          <ProductTable products={hiddenProducts} title="Produits masqués" />
        </TabsContent>
      </Tabs>

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
