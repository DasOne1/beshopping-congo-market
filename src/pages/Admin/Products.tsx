
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Package, Filter, Eye, EyeOff, Grid3X3, List, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProducts, Product } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import AdminLayout from '@/components/Admin/AdminLayout';

const Products = () => {
  const navigate = useNavigate();
  const { products, isLoading, deleteProduct, updateProduct } = useProducts();
  const { categories } = useCategories();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const handleDeleteProduct = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct.mutate(id);
    }
  };

  const toggleVisibility = (id: string, currentVisibility: boolean) => {
    updateProduct.mutate({
      id,
      is_visible: !currentVisibility
    });
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return 'Aucune catégorie';
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return 'Catégorie introuvable';
    
    // Si c'est une sous-catégorie, afficher "Parent > Enfant"
    if (category.parent_id) {
      const parent = categories.find(cat => cat.id === category.parent_id);
      return parent ? `${parent.name} > ${category.name}` : category.name;
    }
    
    return category.name;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;
    const matchesVisibility = visibilityFilter === 'all' || 
      (visibilityFilter === 'visible' && product.is_visible) ||
      (visibilityFilter === 'hidden' && !product.is_visible);

    return matchesSearch && matchesStatus && matchesCategory && matchesVisibility;
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-300">Chargement des produits...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const visibleCount = products.filter(p => p.is_visible).length;
  const hiddenCount = products.filter(p => !p.is_visible).length;
  const activeCount = products.filter(p => p.status === 'active').length;
  const inactiveCount = products.filter(p => p.status === 'inactive').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <Package className="mr-3 h-6 w-6 text-blue-600" />
              Gestion des Produits
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gérez votre catalogue de produits
            </p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-green-600">
                {visibleCount} visible{visibleCount > 1 ? 's' : ''}
              </span>
              {hiddenCount > 0 && (
                <span className="text-red-600">
                  {hiddenCount} masqué{hiddenCount > 1 ? 's' : ''}
                </span>
              )}
              <span className="text-blue-600">
                {activeCount} actif{activeCount > 1 ? 's' : ''}
              </span>
              {inactiveCount > 0 && (
                <span className="text-orange-600">
                  {inactiveCount} inactif{inactiveCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <Button 
            onClick={() => navigate('/dasgabriel@adminaccess/catalog/new')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>

        {/* Filtres */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label htmlFor="search">Rechercher</Label>
                <Input
                  id="search"
                  placeholder="Nom, description, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="visibility">Visibilité</Label>
                <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    <SelectItem value="visible">Visibles</SelectItem>
                    <SelectItem value="hidden">Masqués</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.parent_id ? `${categories.find(c => c.id === category.parent_id)?.name} > ${category.name}` : category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-r-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-l-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des produits */}
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
            <CardTitle className="text-lg">Produits ({filteredProducts.length})</CardTitle>
            <CardDescription>
              Gérez tous vos produits depuis cette interface
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {viewMode === 'list' ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                      <TableHead className="w-[100px]">Image</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Prix</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Visibilité</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product) => (
                      <TableRow 
                        key={product.id} 
                        className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${!product.is_visible ? 'opacity-60 bg-gray-100 dark:bg-gray-900' : ''}`}
                      >
                        <TableCell>
                          {product.images && product.images.length > 0 ? (
                            <img 
                              src={product.images[0]} 
                              alt={product.name} 
                              className="w-16 h-12 object-cover rounded" 
                            />
                          ) : (
                            <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                              <Upload className="h-4 w-4 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className={`font-medium ${!product.is_visible ? 'line-through text-gray-500' : ''}`}>
                              {product.name}
                            </span>
                            <div className="flex gap-1 mt-1">
                              {product.featured && (
                                <Badge variant="secondary" className="text-xs">Vedette</Badge>
                              )}
                              {!product.is_visible && (
                                <Badge variant="destructive" className="text-xs">Masqué</Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={!product.is_visible ? 'text-gray-500' : ''}>
                            {getCategoryName(product.category_id)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className={`flex flex-col ${!product.is_visible ? 'text-gray-500' : ''}`}>
                            {product.discounted_price ? (
                              <>
                                <span className="text-sm line-through text-gray-500">
                                  {product.original_price.toLocaleString()} FC
                                </span>
                                <span className="font-medium text-green-600">
                                  {product.discounted_price.toLocaleString()} FC
                                </span>
                              </>
                            ) : (
                              <span className="font-medium">
                                {product.original_price.toLocaleString()} FC
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={product.stock > 0 ? "default" : "destructive"}
                            className={!product.is_visible ? 'opacity-60' : ''}
                          >
                            {product.stock} en stock
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={product.status === 'active' ? "default" : "secondary"}
                            className={!product.is_visible ? 'opacity-60' : ''}
                          >
                            {product.status === 'active' ? 'Actif' : 'Inactif'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={product.is_visible}
                              onCheckedChange={() => toggleVisibility(product.id, product.is_visible)}
                            />
                            <span className="text-sm">
                              {product.is_visible ? (
                                <span className="flex items-center text-green-600">
                                  <Eye className="h-4 w-4 mr-1" />
                                  Visible
                                </span>
                              ) : (
                                <span className="flex items-center text-red-600">
                                  <EyeOff className="h-4 w-4 mr-1" />
                                  Masqué
                                </span>
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/dasgabriel@adminaccess/catalog/edit/${product.id}`)}
                            >
                              <Edit className="mr-1 h-4 w-4" />
                              Modifier
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={deleteProduct.isPending}
                            >
                              <Trash2 className="mr-1 h-4 w-4" />
                              Supprimer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${!product.is_visible ? 'opacity-60 bg-gray-100 dark:bg-gray-900' : ''}`}
                  >
                    <div className="aspect-square overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <Upload className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className={`font-medium mb-2 ${!product.is_visible ? 'line-through text-gray-500' : ''}`}>
                        {product.name}
                      </h3>
                      <p className={`text-sm text-gray-600 mb-2 ${!product.is_visible ? 'text-gray-500' : ''}`}>
                        {getCategoryName(product.category_id)}
                      </p>
                      <div className="flex justify-between items-center mb-3">
                        <div className={!product.is_visible ? 'text-gray-500' : ''}>
                          {product.discounted_price ? (
                            <div className="flex flex-col">
                              <span className="text-sm line-through text-gray-500">
                                {product.original_price.toLocaleString()} FC
                              </span>
                              <span className="font-medium text-green-600">
                                {product.discounted_price.toLocaleString()} FC
                              </span>
                            </div>
                          ) : (
                            <span className="font-medium">
                              {product.original_price.toLocaleString()} FC
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          <Switch
                            checked={product.is_visible}
                            onCheckedChange={() => toggleVisibility(product.id, product.is_visible)}
                          />
                          {product.is_visible ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/dasgabriel@adminaccess/catalog/edit/${product.id}`)}
                          className="flex-1"
                        >
                          <Edit className="mr-1 h-4 w-4" />
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={deleteProduct.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Package className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-lg font-medium mb-2">Aucun produit trouvé</p>
                <p className="text-sm mb-4">Aucun produit ne correspond à vos critères de recherche</p>
                <Button 
                  onClick={() => navigate('/dasgabriel@adminaccess/catalog/new')} 
                  variant="outline"
                >
                  Ajouter un produit
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Products;
