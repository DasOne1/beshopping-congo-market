
import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, Search, Package, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import AdminLayout from '@/components/Admin/AdminLayout';

const Products = () => {
  const navigate = useNavigate();
  const { products, isLoading, deleteProduct } = useProducts();
  const { categories } = useCategories();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct.mutate(id);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Sans catégorie';
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
      
      const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;
      
      const matchesStock = stockFilter === 'all' || 
                          (stockFilter === 'in-stock' && product.stock > 0) ||
                          (stockFilter === 'low-stock' && product.stock > 0 && product.stock <= 5) ||
                          (stockFilter === 'out-of-stock' && product.stock === 0);

      return matchesSearch && matchesStatus && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, statusFilter, categoryFilter, stockFilter]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Chargement des produits...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center">
              <Package className="mr-3 h-6 w-6 text-primary" />
              Gestion des Produits
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez votre catalogue de produits ({filteredProducts.length} sur {products.length})
            </p>
          </div>
          <Button 
            onClick={() => navigate('/admin/products/new')}
            className="shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>

        {/* Products Table with Integrated Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Liste des Produits</CardTitle>
            <CardDescription>
              {filteredProducts.length} produit(s) trouvé(s)
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10 border-b-2">
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead className="min-w-[250px]">
                      <div className="space-y-2">
                        <span className="font-medium">Produit</span>
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                          <Input
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 h-8 text-xs"
                          />
                        </div>
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[150px]">
                      <div className="space-y-2">
                        <span className="font-medium">Catégorie</span>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Toutes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Toutes</SelectItem>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead className="min-w-[120px]">
                      <div className="space-y-2">
                        <span className="font-medium">Stock</span>
                        <Select value={stockFilter} onValueChange={setStockFilter}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Tous" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous</SelectItem>
                            <SelectItem value="in-stock">En stock</SelectItem>
                            <SelectItem value="low-stock">Stock faible</SelectItem>
                            <SelectItem value="out-of-stock">Rupture</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[100px]">
                      <div className="space-y-2">
                        <span className="font-medium">Statut</span>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Tous" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tous</SelectItem>
                            <SelectItem value="active">Actif</SelectItem>
                            <SelectItem value="inactive">Inactif</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted">
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name} 
                              className="w-full h-full object-cover" 
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-foreground line-clamp-1">
                            {product.name}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {product.description}
                          </div>
                          <div className="flex items-center gap-2">
                            {product.featured && (
                              <Badge variant="secondary" className="text-xs">
                                Vedette
                              </Badge>
                            )}
                            {product.discounted_price && (
                              <Badge variant="destructive" className="text-xs">
                                Promo
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {getCategoryName(product.category_id || '')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-foreground">
                            {formatPrice(product.discounted_price || product.original_price)} FC
                          </div>
                          {product.discounted_price && (
                            <div className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.original_price)} FC
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            product.stock === 0 ? 'destructive' :
                            product.stock <= 5 ? 'secondary' : 'default'
                          }
                          className="text-xs"
                        >
                          {product.stock === 0 ? 'Rupture' : `${product.stock} unités`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={product.status === 'active' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {product.status === 'active' ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={deleteProduct.isPending}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-medium mb-2">Aucun produit trouvé</p>
                  <p className="text-sm mb-4">
                    {products.length === 0 
                      ? "Commencez par créer votre premier produit"
                      : "Essayez de modifier vos filtres de recherche"
                    }
                  </p>
                  <Button onClick={() => navigate('/admin/products/new')} variant="outline">
                    Créer un produit
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Products;
