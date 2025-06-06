
import React, { useState } from 'react';
import { Plus, Search, Package, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import AdminLayout from '@/components/Admin/AdminLayout';
import { toast } from '@/components/ui/use-toast';

const Products = () => {
  const navigate = useNavigate();
  const { products, isLoading, deleteProduct, updateProduct } = useProducts();
  const { categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('all');

  const handleDeleteProduct = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct.mutate(id);
    }
  };

  const handleToggleVisibility = async (id: string, isVisible: boolean) => {
    try {
      await updateProduct.mutateAsync({
        id,
        data: { is_visible: isVisible }
      });
      toast({
        title: "Visibilité mise à jour",
        description: `Le produit est maintenant ${isVisible ? 'visible' : 'masqué'}.`,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la visibilité:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    const matchesVisibility = visibilityFilter === 'all' || 
                             (visibilityFilter === 'visible' && product.is_visible) ||
                             (visibilityFilter === 'hidden' && !product.is_visible);
    
    return matchesSearch && matchesCategory && matchesVisibility;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'CDF'
    }).format(price);
  };

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
          </div>
          <Button 
            onClick={() => navigate('/dasgabriel@adminaccess/products/new')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>

        {/* Filtres et recherche */}
        <Card>
          <CardHeader>
            <CardTitle>Recherche et filtres</CardTitle>
            <CardDescription>
              Filtrez et recherchez dans vos produits ({filteredProducts.length} sur {products.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les produits" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les produits</SelectItem>
                  <SelectItem value="visible">Produits visibles</SelectItem>
                  <SelectItem value="hidden">Produits masqués</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Liste des produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const category = categories.find(c => c.id === product.category_id);
            
            return (
              <Card key={product.id} className={`${!product.is_visible ? 'opacity-60 border-dashed' : ''}`}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Image du produit */}
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Informations du produit */}
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium line-clamp-2">{product.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleVisibility(product.id, !product.is_visible)}
                          >
                            {product.is_visible ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={product.is_visible ? "default" : "secondary"}>
                          {product.is_visible ? "Visible" : "Masqué"}
                        </Badge>
                        {category && (
                          <Badge variant="outline">{category.name}</Badge>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-lg font-bold text-blue-600">
                          {formatPrice(product.discounted_price || product.original_price)}
                        </p>
                        {product.discounted_price && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatPrice(product.original_price)}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/dasgabriel@adminaccess/products/edit/${product.id}`)}
                        className="flex-1"
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-lg font-medium mb-2">Aucun produit trouvé</p>
              <p className="text-sm mb-4">
                {searchTerm || selectedCategory ? 
                  'Aucun produit ne correspond à vos critères de recherche.' :
                  'Commencez par créer votre premier produit'
                }
              </p>
              <Button 
                onClick={() => navigate('/dasgabriel@adminaccess/products/new')} 
                variant="outline"
              >
                Créer un produit
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Products;
