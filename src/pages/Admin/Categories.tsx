
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Upload, FolderOpen, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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
  const { categories, isLoading, deleteCategory, updateCategory } = useCategories();
  
  const handleDeleteCategory = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      deleteCategory.mutate(id);
    }
  };

  const toggleVisibility = (id: string, currentVisibility: boolean) => {
    updateCategory.mutate({
      id,
      is_visible: !currentVisibility
    });
  };

  // Organiser les catégories en hiérarchie - montrer TOUTES les catégories côté admin
  const rootCategories = categories.filter(cat => !cat.parent_id);
  const getSubCategories = (parentId: string) => categories.filter(cat => cat.parent_id === parentId);

  const renderCategoryRow = (category: any, level: number = 0) => {
    const subCategories = getSubCategories(category.id);
    const indent = level * 20;

    return (
      <React.Fragment key={category.id}>
        <TableRow className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 ${!category.is_visible ? 'opacity-60 bg-gray-100 dark:bg-gray-900' : ''}`}>
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
          <TableCell>
            <div className="flex items-center" style={{ paddingLeft: `${indent}px` }}>
              {level > 0 && <span className="text-gray-400 mr-2">└─</span>}
              <div className="flex items-center gap-2">
                <span className={`font-medium ${!category.is_visible ? 'line-through text-gray-500' : ''}`}>
                  {category.name}
                </span>
                {level > 0 && <Badge variant="outline" className="text-xs">Sous-catégorie</Badge>}
                {subCategories.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {subCategories.length} sous-catégorie{subCategories.length > 1 ? 's' : ''}
                  </Badge>
                )}
                {!category.is_visible && (
                  <Badge variant="destructive" className="text-xs">Masqué</Badge>
                )}
              </div>
            </div>
          </TableCell>
          <TableCell className={!category.is_visible ? 'text-gray-500' : ''}>
            {category.description || 'Aucune description'}
          </TableCell>
          <TableCell>
            <code className={`text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded ${!category.is_visible ? 'text-gray-500' : ''}`}>
              {category.slug}
            </code>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <Switch
                checked={category.is_visible}
                onCheckedChange={() => toggleVisibility(category.id, category.is_visible)}
              />
              <span className="text-sm">
                {category.is_visible ? (
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
                onClick={() => navigate(`/dasgabriel@adminaccess/categories/edit/${category.id}`)}
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
        {/* Afficher les sous-catégories */}
        {subCategories.map(subCategory => renderCategoryRow(subCategory, level + 1))}
      </React.Fragment>
    );
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
  
  const visibleCount = categories.filter(cat => cat.is_visible).length;
  const hiddenCount = categories.filter(cat => !cat.is_visible).length;
  
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
              Organisez vos produits par catégories et sous-catégories
            </p>
            <div className="flex gap-4 mt-2">
              <span className="text-sm text-green-600">
                {visibleCount} visible{visibleCount > 1 ? 's' : ''}
              </span>
              {hiddenCount > 0 && (
                <span className="text-sm text-red-600">
                  {hiddenCount} masqué{hiddenCount > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <Button 
            onClick={() => navigate('/dasgabriel@adminaccess/categories/new')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une catégorie
          </Button>
        </div>
        
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
            <CardTitle className="text-lg">Liste des Catégories ({categories.length})</CardTitle>
            <CardDescription>
              Gérez toutes vos catégories et sous-catégories depuis cette interface.
              Les catégories masquées apparaissent grisées et ne sont pas visibles pour les utilisateurs.
            </CardDescription>
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
                    <TableHead>Visibilité</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rootCategories.map(category => renderCategoryRow(category))}
                </TableBody>
              </Table>
              
              {categories.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <FolderOpen className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-lg font-medium mb-2">Aucune catégorie trouvée</p>
                  <p className="text-sm mb-4">Commencez par créer votre première catégorie</p>
                  <Button 
                    onClick={() => navigate('/dasgabriel@adminaccess/categories/new')} 
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
