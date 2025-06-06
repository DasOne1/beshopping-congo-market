
import React, { useState } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCategories, Category } from '@/hooks/useCategories';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2 } from 'lucide-react';
import CategoryForm from './CategoryForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CategoryHierarchyProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (category: Category) => void;
  level?: number;
}

const CategoryHierarchy: React.FC<CategoryHierarchyProps> = ({ 
  categories, 
  onEdit, 
  onDelete, 
  onToggleVisibility, 
  level = 0 
}) => {
  const rootCategories = categories.filter(cat => !cat.parent_id);
  
  const getSubcategories = (parentId: string) => {
    return categories.filter(cat => cat.parent_id === parentId);
  };

  const renderCategory = (category: Category, depth: number = 0) => (
    <React.Fragment key={category.id}>
      <TableRow>
        <TableCell style={{ paddingLeft: `${depth * 20 + 16}px` }}>
          {category.name}
        </TableCell>
        <TableCell>{category.slug}</TableCell>
        <TableCell>{category.description || '-'}</TableCell>
        <TableCell>
          <Switch 
            checked={category.is_visible} 
            onCheckedChange={() => onToggleVisibility(category)}
          />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(category.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {getSubcategories(category.id).map(subcategory => 
        renderCategory(subcategory, depth + 1)
      )}
    </React.Fragment>
  );

  return (
    <>
      {rootCategories.map(category => renderCategory(category))}
    </>
  );
};

const Categories = () => {
  const { categories, isLoading, createCategory, updateCategory, deleteCategory } = useCategories();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowDialog(true);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowDialog(true);
  };

  const handleSave = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          ...categoryData
        });
      } else {
        await createCategory.mutateAsync(categoryData);
      }
      setShowDialog(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await deleteCategory.mutateAsync(id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleToggleVisibility = async (category: Category) => {
    try {
      await updateCategory.mutateAsync({
        id: category.id,
        is_visible: !category.is_visible
      });
    } catch (error) {
      console.error('Erreur lors du changement de visibilité:', error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Catégories</h1>
            <p className="text-muted-foreground">Organisez vos produits par catégories</p>
          </div>
          <div className="text-center py-8">Chargement...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Catégories</h1>
            <p className="text-muted-foreground">Organisez vos produits par catégories</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Catégorie
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <CategoryHierarchy 
                  categories={categories}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleVisibility={handleToggleVisibility}
                />
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm
              category={editingCategory}
              categories={categories}
              onSave={handleSave}
              onCancel={() => setShowDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Categories;
