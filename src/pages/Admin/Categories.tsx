
import React, { useState } from 'react';
import { Plus, Search, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCategories } from '@/hooks/useCategories';
import CategoryHierarchy from '@/components/Admin/CategoryHierarchy';
import AdminLayout from '@/components/Admin/AdminLayout';
import { toast } from '@/components/ui/use-toast';

const Categories = () => {
  const navigate = useNavigate();
  const { categories, isLoading, deleteCategory, updateCategory } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleDeleteCategory = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Cela supprimera aussi toutes ses sous-catégories.')) {
      deleteCategory.mutate(id);
    }
  };

  const handleToggleVisibility = async (id: string, isVisible: boolean) => {
    try {
      await updateCategory.mutateAsync({
        id,
        data: { is_visible: isVisible }
      });
      toast({
        title: "Visibilité mise à jour",
        description: `La catégorie est maintenant ${isVisible ? 'visible' : 'masquée'}.`,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la visibilité:', error);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              Organisez vos produits par catégories et sous-catégories
            </p>
          </div>
          <Button 
            onClick={() => navigate('/dasgabriel@adminaccess/categories/new')}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une catégorie
          </Button>
        </div>

        {/* Barre de recherche */}
        <Card>
          <CardHeader>
            <CardTitle>Recherche et filtres</CardTitle>
            <CardDescription>
              Recherchez dans vos catégories ({filteredCategories.length} sur {categories.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hiérarchie des catégories */}
        <CategoryHierarchy
          categories={filteredCategories}
          onDeleteCategory={handleDeleteCategory}
          onToggleVisibility={handleToggleVisibility}
        />

        {categories.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <FolderOpen className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-lg font-medium mb-2">Aucune catégorie trouvée</p>
              <p className="text-sm mb-4">Commencez par créer votre première catégorie</p>
              <Button 
                onClick={() => navigate('/dasgabriel@adminaccess/categories/new')} 
                variant="outline"
              >
                Créer une catégorie
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default Categories;
