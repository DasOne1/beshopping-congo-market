
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

export default function Catalog() {
  const navigate = useNavigate();
  const { products, isLoading: productsLoading, deleteProduct } = useProducts();
  const { categories, isLoading: categoriesLoading, deleteCategory } = useCategories();

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

  if (productsLoading || categoriesLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Chargement...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Package className="mr-2 h-6 w-6" />
              Catalog
            </h1>
            <p className="text-muted-foreground">Gérer les produits et catégories</p>
          </div>
        </div>
        
        <Tabs defaultValue="products">
          <TabsList className="mb-4">
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="categories">Catégories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Produits</CardTitle>
                    <CardDescription>Gérer vos produits</CardDescription>
                  </div>
                  <Button onClick={() => navigate('/admin/products')}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un produit
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Aucun produit trouvé</p>
                    <Button onClick={() => navigate('/admin/products')} variant="outline" className="mt-4">
                      Ajouter un produit
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.slice(0, 10).map((product) => (
                      <div 
                        key={product.id}
                        className="flex justify-between items-center p-3 rounded-lg bg-background border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                            {product.images && product.images.length > 0 ? (
                              <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                <Package className="h-4 w-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatPrice(product.discounted_price || product.original_price)} CDF
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => navigate('/admin/products')}>
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {products.length > 10 && (
                      <Button onClick={() => navigate('/admin/products')} variant="outline" className="w-full mt-2">
                        Voir tous ({products.length}) les produits
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Catégories</CardTitle>
                    <CardDescription>Gérer vos catégories de produits</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => navigate('/admin/categories')}>
                    <Plus className="h-4 w-4 mr-1" />
                    Ajouter une catégorie
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Aucune catégorie trouvée</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/categories')}>
                      Ajouter une catégorie
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div 
                        key={category.id}
                        className="flex justify-between items-center p-3 rounded-lg bg-background border"
                      >
                        <div className="flex items-center gap-3">
                          {category.image && (
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                              <img 
                                src={category.image} 
                                alt={category.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{category.name}</div>
                            {category.description && (
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {category.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => navigate('/admin/categories')}>
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
