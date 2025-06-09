
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, FolderOpen } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { formatDate } from '@/lib/utils';
import CategoryDialog from './CategoryDialog';
import CategoryDetailDialog from './CategoryDetailDialog';

interface CategoriesSectionProps {
  searchTerm: string;
}

const CategoriesSection = ({ searchTerm }: CategoriesSectionProps) => {
  const { categories, isLoading, updateCategory, deleteCategory } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const toggleVisibility = async (category: any) => {
    await updateCategory.mutateAsync({
      id: category.id,
      is_visible: !category.is_visible
    });
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      await deleteCategory.mutateAsync(categoryId);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <div className="flex items-center gap-2">
                  {category.is_visible ? (
                    <Eye className="h-4 w-4 text-green-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {category.image && (
                <div className="w-full h-32 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {category.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {category.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <Badge variant={category.parent_id ? "secondary" : "default"}>
                  {category.parent_id ? "Sous-catégorie" : "Catégorie principale"}
                </Badge>
                <span className="text-sm text-gray-500">
                  0 produits
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-400">
                  {formatDate(category.created_at)}
                </span>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(category);
                      setIsDetailDialogOpen(true);
                    }}
                  >
                    <FolderOpen className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategory(category);
                      setIsCreateDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibility(category);
                    }}
                  >
                    {category.is_visible ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(category.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialogs */}
      <CategoryDialog
        category={selectedCategory}
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) setSelectedCategory(null);
        }}
      />
      
      <CategoryDetailDialog
        category={selectedCategory}
        open={isDetailDialogOpen}
        onOpenChange={(open) => {
          setIsDetailDialogOpen(open);
          if (!open) setSelectedCategory(null);
        }}
      />
    </div>
  );
};

export default CategoriesSection;
