
import React from 'react';
import { Plus, Edit, Trash2, Upload, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategories } from '@/hooks/useCategories';
import AdminLayout from '@/components/Admin/AdminLayout';

const Categories = () => {
  const navigate = useNavigate();
  const { categories, isLoading, deleteCategory } = useCategories();
  
  const handleDeleteCategory = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      deleteCategory.mutate(id);
    }
  };
  
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 dark:text-gray-300">Chargement des catégories...</p>
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
              <FolderOpen className="mr-3 h-6 w-6 text-blue-600" />
              Gestion des Catégories
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Organisez vos produits par catégories
            </p>
          </div>
          <Button 
            onClick={() => navigate('/admin/categories/new')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une catégorie
          </Button>
        </div>
        
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
            <CardTitle className="text-lg">Liste des Catégories ({categories.length})</CardTitle>
            <CardDescription>Gérez toutes vos catégories depuis cette interface</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell>
                        {category.image ? (
                          <img 
                            src={category.image} 
                            alt={category.name} 
                            className="w-16 h-12 object-cover rounded" 
                          />
                        ) : (
                          <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                            <Upload className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description || 'Aucune description'}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            disabled={deleteCategory.isPending}
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
              
              {categories.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <FolderOpen className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-lg font-medium mb-2">Aucune catégorie trouvée</p>
                  <p className="text-sm mb-4">Commencez par créer votre première catégorie</p>
                  <Button 
                    onClick={() => navigate('/admin/categories/new')} 
                    variant="outline"
                  >
                    Créer une catégorie
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

export default Categories;
