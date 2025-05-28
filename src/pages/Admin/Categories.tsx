import React, { useState } from 'react';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminLayout from '@/components/Admin/AdminLayout';
import { useCategories, Category } from '@/hooks/useCategories';
import { useAuth } from '@/hooks/useAuth';

const Categories = () => {
  const { user } = useAuth();
  const { categories, isLoading, createCategory, updateCategory, deleteCategory } = useCategories();
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    image: '',
  });
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  if (!user) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </AdminLayout>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingCategory(prev => {
      if (prev) {
        return { ...prev, [name]: value };
      }
      return prev;
    });
  };
  
  const handleAddCategory = () => {
    if (!newCategory.name) return;
    
    const slug = newCategory.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    
    createCategory.mutate({
      name: newCategory.name,
      slug,
      description: newCategory.description || undefined,
      image: newCategory.image || undefined,
    });
    
    setNewCategory({ name: '', description: '', image: '' });
  };
  
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };
  
  const handleUpdateCategory = () => {
    if (!editingCategory?.name || !editingCategory.id) return;
    
    const slug = editingCategory.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    
    updateCategory.mutate({
      id: editingCategory.id,
      name: editingCategory.name,
      slug,
      description: editingCategory.description,
      image: editingCategory.image,
    });
    
    setEditingCategory(null);
  };
  
  const handleDeleteCategory = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      deleteCategory.mutate(id);
    }
  };
  
  if (isLoading) {
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
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Gestion des Catégories</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Formulaire d'ajout */}
          <Card>
            <CardHeader>
              <CardTitle>Ajouter une Catégorie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                name="name"
                placeholder="Nom de la catégorie"
                value={newCategory.name}
                onChange={handleInputChange}
              />
              <Textarea
                name="description"
                placeholder="Description"
                value={newCategory.description}
                onChange={handleInputChange}
              />
              <Input
                type="url"
                name="image"
                placeholder="URL de l'image"
                value={newCategory.image}
                onChange={handleInputChange}
              />
              <Button 
                onClick={handleAddCategory}
                disabled={createCategory.isPending || !newCategory.name}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                {createCategory.isPending ? 'Ajout...' : 'Ajouter'}
              </Button>
            </CardContent>
          </Card>
          
          {/* Formulaire d'édition */}
          {editingCategory && (
            <Card>
              <CardHeader>
                <CardTitle>Modifier la Catégorie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  placeholder="Nom de la catégorie"
                  value={editingCategory.name}
                  onChange={handleEditInputChange}
                />
                <Textarea
                  name="description"
                  placeholder="Description"
                  value={editingCategory.description || ''}
                  onChange={handleEditInputChange}
                />
                <Input
                  type="url"
                  name="image"
                  placeholder="URL de l'image"
                  value={editingCategory.image || ''}
                  onChange={handleEditInputChange}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleUpdateCategory}
                    disabled={updateCategory.isPending}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {updateCategory.isPending ? 'Mise à jour...' : 'Mettre à jour'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingCategory(null)}
                  >
                    Annuler
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <Separator className="my-6" />
        
        {/* Liste des catégories */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Catégories ({categories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>Liste de toutes vos catégories.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        {category.image ? (
                          <img 
                            src={category.image} 
                            alt={category.name} 
                            className="w-16 h-12 object-cover rounded" 
                          />
                        ) : (
                          <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <Upload className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description || 'Aucune description'}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCategory(category)}
                            disabled={editingCategory?.id === category.id}
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
                <div className="text-center py-8 text-gray-500">
                  Aucune catégorie trouvée. Créez votre première catégorie ci-dessus.
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
