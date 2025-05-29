
import React from 'react';
import { Plus, Edit, Trash2, Upload, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProducts } from '@/hooks/useProducts';
import AdminLayout from '@/components/Admin/AdminLayout';

const Products = () => {
  const navigate = useNavigate();
  const { products, isLoading, deleteProduct } = useProducts();

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct.mutate(id);
    }
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
            onClick={() => navigate('/admin/products/new')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
            <CardTitle className="text-lg">Liste des Produits ({products.length})</CardTitle>
            <CardDescription>Gérez tous vos produits depuis cette interface</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
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
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {product.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {formatPrice(product.discounted_price || product.original_price)} FC
                          </div>
                          {product.discounted_price && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                              {formatPrice(product.original_price)} FC
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock === 0 
                            ? 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-500' 
                            : product.stock <= 5 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-500'
                            : 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-500'
                        }`}>
                          {product.stock === 0 ? 'Rupture' : `${product.stock} unités`}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.status === 'active' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-500' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-500'
                        }`}>
                          {product.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={deleteProduct.isPending}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {products.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Package className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-lg font-medium mb-2">Aucun produit trouvé</p>
                  <p className="text-sm mb-4">Commencez par créer votre premier produit</p>
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
