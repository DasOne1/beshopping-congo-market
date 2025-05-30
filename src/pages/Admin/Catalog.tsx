import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, FolderOpen, Plus, Edit, Trash2, ArrowLeft, Grid, MoreVertical } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ViewMode = 'overview' | 'categories' | 'products' | 'category-products';

export default function Catalog() {
  const navigate = useNavigate();
  const { products, isLoading: productsLoading, deleteProduct } = useProducts();
  const { categories, isLoading: categoriesLoading, deleteCategory } = useCategories();
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleDeleteProduct = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct.mutate(id);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      deleteCategory.mutate(id);
    }
  };

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(product => product.category_id === categoryId);
  };

  const getSelectedCategoryName = () => {
    const category = categories.find(cat => cat.id === selectedCategory);
    return category?.name || 'Catégorie inconnue';
  };

  if (productsLoading || categoriesLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Chargement du catalogue...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {viewMode !== 'overview' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (viewMode === 'category-products') {
                    setViewMode('categories');
                  } else {
                    setViewMode('overview');
                  }
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center">
                <Package className="mr-3 h-6 w-6 text-primary" />
                {viewMode === 'overview' && 'Catalogue'}
                {viewMode === 'categories' && 'Gestion des Catégories'}
                {viewMode === 'products' && 'Gestion des Produits'}
                {viewMode === 'category-products' && `Produits - ${getSelectedCategoryName()}`}
              </h1>
              <p className="text-muted-foreground mt-1">
                {viewMode === 'overview' && 'Vue d\'ensemble de votre catalogue'}
                {viewMode === 'categories' && 'Organisez vos produits par catégories'}
                {viewMode === 'products' && 'Gérez votre inventaire de produits'}
                {viewMode === 'category-products' && `${getProductsByCategory(selectedCategory || '').length} produit(s) dans cette catégorie`}
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Categories Card */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <div onClick={() => setViewMode('categories')}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Catégories</CardTitle>
                          <CardDescription>Organisez vos produits</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-lg font-semibold px-3 py-1">
                        {categories.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total des catégories</span>
                        <span className="font-medium">{categories.length}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((categories.length / 20) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Cliquez pour gérer vos catégories
                      </p>
                    </div>
                  </CardContent>
                </div>
              </Card>

              {/* Products Card */}
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <div onClick={() => setViewMode('products')}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                          <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Produits</CardTitle>
                          <CardDescription>Gérez votre inventaire</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-lg font-semibold px-3 py-1">
                        {products.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">En stock</span>
                          <span className="font-medium text-green-600">
                            {products.filter(p => p.stock > 0).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rupture</span>
                          <span className="font-medium text-red-600">
                            {products.filter(p => p.stock === 0).length}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${products.length > 0 ? (products.filter(p => p.stock > 0).length / products.length) * 100 : 0}%` 
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Cliquez pour gérer vos produits
                      </p>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          )}

          {viewMode === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Liste des Catégories</CardTitle>
                      <CardDescription>Gérez et organisez vos catégories</CardDescription>
                    </div>
                    <Button onClick={() => navigate('/admin/categories/new')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouvelle catégorie
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {categories.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-lg font-medium mb-2">Aucune catégorie trouvée</p>
                      <p className="text-sm mb-4">Créez votre première catégorie pour organiser vos produits</p>
                      <Button onClick={() => navigate('/admin/categories/new')} variant="outline">
                        Créer une catégorie
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {categories.map((category) => (
                        <Card key={category.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div 
                                  className="flex-1 cursor-pointer"
                                  onClick={() => {
                                    setSelectedCategory(category.id);
                                    setViewMode('category-products');
                                  }}
                                >
                                  {category.image && (
                                    <div className="w-full h-32 bg-muted rounded-lg mb-3 overflow-hidden">
                                      <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                                      />
                                    </div>
                                  )}
                                  <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                                  {category.description && (
                                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                      {category.description}
                                    </p>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {getProductsByCategory(category.id).length} produit(s)
                                  </Badge>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => navigate(`/admin/categories/edit/${category.id}`)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Modifier
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteCategory(category.id)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Supprimer
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {viewMode === 'products' && (
            <motion.div
              key="products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Liste des Produits</CardTitle>
                      <CardDescription>Gérez votre inventaire complet</CardDescription>
                    </div>
                    <Button onClick={() => navigate('/admin/products/new')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau produit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {products.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-lg font-medium mb-2">Aucun produit trouvé</p>
                      <p className="text-sm mb-4">Ajoutez votre premier produit à votre catalogue</p>
                      <Button onClick={() => navigate('/admin/products/new')} variant="outline">
                        Créer un produit
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {categories.map((category) => {
                        const categoryProducts = getProductsByCategory(category.id);
                        if (categoryProducts.length === 0) return null;

                        return (
                          <div key={category.id} className="space-y-4">
                            <div className="flex items-center gap-3 pb-2 border-b">
                              <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                              <Badge variant="secondary">{categoryProducts.length} produit(s)</Badge>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                              {categoryProducts.map((product) => (
                                <Card key={product.id} className="hover:shadow-md transition-shadow">
                                  <CardContent className="p-4">
                                    <div className="space-y-3">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="w-full h-32 bg-muted rounded-lg mb-3 overflow-hidden">
                                            {product.images && product.images.length > 0 ? (
                                              <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <Package className="h-8 w-8 text-muted-foreground" />
                                              </div>
                                            )}
                                          </div>
                                          <h4 className="font-semibold text-foreground mb-1 line-clamp-1">
                                            {product.name}
                                          </h4>
                                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                            {product.description}
                                          </p>
                                          <div className="flex items-center justify-between">
                                            <div>
                                              <p className="font-semibold text-foreground">
                                                {formatPrice(product.discounted_price || product.original_price)} FC
                                              </p>
                                              {product.discounted_price && (
                                                <p className="text-xs text-muted-foreground line-through">
                                                  {formatPrice(product.original_price)} FC
                                                </p>
                                              )}
                                            </div>
                                            <Badge 
                                              variant={product.stock > 0 ? "default" : "destructive"}
                                              className="text-xs"
                                            >
                                              {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                                            </Badge>
                                          </div>
                                        </div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                              <MoreVertical className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => navigate(`/admin/products/edit/${product.id}`)}>
                                              <Edit className="mr-2 h-4 w-4" />
                                              Modifier
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                              onClick={() => handleDeleteProduct(product.id)}
                                              className="text-red-600"
                                            >
                                              <Trash2 className="mr-2 h-4 w-4" />
                                              Supprimer
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      {/* Products without category */}
                      {products.filter(p => !p.category_id).length > 0 && (
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 pb-2 border-b">
                            <h3 className="text-lg font-semibold text-foreground">Sans catégorie</h3>
                            <Badge variant="outline">{products.filter(p => !p.category_id).length} produit(s)</Badge>
                          </div>
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {products.filter(p => !p.category_id).map((product) => (
                              <Card key={product.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                  {/* Same product card content structure */}
                                  <div className="space-y-3">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="w-full h-32 bg-muted rounded-lg mb-3 overflow-hidden">
                                          {product.images && product.images.length > 0 ? (
                                            <img
                                              src={product.images[0]}
                                              alt={product.name}
                                              className="w-full h-full object-cover"
                                            />
                                          ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                              <Package className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                          )}
                                        </div>
                                        <h4 className="font-semibold text-foreground mb-1 line-clamp-1">
                                          {product.name}
                                        </h4>
                                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                          {product.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="font-semibold text-foreground">
                                              {formatPrice(product.discounted_price || product.original_price)} FC
                                            </p>
                                            {product.discounted_price && (
                                              <p className="text-xs text-muted-foreground line-through">
                                                {formatPrice(product.original_price)} FC
                                              </p>
                                            )}
                                          </div>
                                          <Badge 
                                            variant={product.stock > 0 ? "default" : "destructive"}
                                            className="text-xs"
                                          >
                                            {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                                          </Badge>
                                        </div>
                                      </div>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <MoreVertical className="h-4 w-4" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem onClick={() => navigate(`/admin/products/edit/${product.id}`)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Modifier
                                          </DropdownMenuItem>
                                          <DropdownMenuItem 
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="text-red-600"
                                          >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Supprimer
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {viewMode === 'category-products' && selectedCategory && (
            <motion.div
              key="category-products"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Produits de la catégorie</CardTitle>
                      <CardDescription>{getSelectedCategoryName()}</CardDescription>
                    </div>
                    <Button onClick={() => navigate('/admin/products/new')}>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau produit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {getProductsByCategory(selectedCategory).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-lg font-medium mb-2">Aucun produit dans cette catégorie</p>
                      <p className="text-sm mb-4">Ajoutez des produits à cette catégorie</p>
                      <Button onClick={() => navigate('/admin/products/new')} variant="outline">
                        Ajouter un produit
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {getProductsByCategory(selectedCategory).map((product) => (
                        <Card key={product.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="w-full h-32 bg-muted rounded-lg mb-3 overflow-hidden">
                                    {product.images && product.images.length > 0 ? (
                                      <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-muted flex items-center justify-center">
                                        <Package className="h-8 w-8 text-muted-foreground" />
                                      </div>
                                    )}
                                  </div>
                                  <h4 className="font-semibold text-foreground mb-1 line-clamp-1">
                                    {product.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                    {product.description}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-semibold text-foreground">
                                        {formatPrice(product.discounted_price || product.original_price)} FC
                                      </p>
                                      {product.discounted_price && (
                                        <p className="text-xs text-muted-foreground line-through">
                                          {formatPrice(product.original_price)} FC
                                        </p>
                                      )}
                                    </div>
                                    <Badge 
                                      variant={product.stock > 0 ? "default" : "destructive"}
                                      className="text-xs"
                                    >
                                      {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                                    </Badge>
                                  </div>
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => navigate(`/admin/products/edit/${product.id}`)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Modifier
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteProduct(product.id)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Supprimer
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
