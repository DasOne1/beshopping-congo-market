
import React, { useState } from 'react';
import { AdminLayout } from '@/components/Admin/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import type { Category } from '@/hooks/useCategories';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Edit, Trash2 } from 'lucide-react';
import CategoryForm from './CategoryForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CategoryHierarchyProps {
  categories: Category[];
  allCategories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (category: Category) => void;
}

const CategoryHierarchy: React.FC<CategoryHierarchyProps> = ({
  categories,
  allCategories,
  onEdit,
  onDelete,
  onToggleVisibility
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Visibilité</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <React.Fragment key={category.id}>
            <TableRow>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>{category.slug}</TableCell>
              <TableCell>
                <Switch
                  id={`visibility-${category.id}`}
                  checked={category.is_visible}
                  onCheckedChange={() => onToggleVisibility(category)}
                />
                <Label htmlFor={`visibility-${category.id}`} className="sr-only">
                  {category.is_visible ? 'Visible' : 'Invisible'}
                </Label>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(category)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(category.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            {allCategories.filter(cat => cat.parent_id === category.id).length > 0 && (
              <TableRow>
                <TableCell colSpan={4} className="pl-8">
                  <CategoryHierarchy
                    categories={allCategories.filter(cat => cat.parent_id === category.id)}
                    allCategories={allCategories}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleVisibility={onToggleVisibility}
                  />
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
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

  const topLevelCategories = categories.filter(cat => !cat.parent_id);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Catégories</h1>
            <p className="text-muted-foreground">Gérez vos catégories et sous-catégories de produits</p>
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
            <p className="text-muted-foreground">Gérez vos catégories et sous-catégories de produits</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Catégorie
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <CategoryHierarchy
              categories={topLevelCategories}
              allCategories={categories}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleVisibility={handleToggleVisibility}
            />
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
