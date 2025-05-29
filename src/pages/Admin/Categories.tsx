import React, { useState } from 'react';
import { Plus, Edit, Trash2, Upload, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCategories, Category } from '@/hooks/useCategories';

const Categories = () => {
  const { categories, isLoading, createCategory, updateCategory, deleteCategory } = useCategories();
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    image: '',
  });
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
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
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement des catégories...</p>
        </div>
      </div>
    );
  }
  
  return (
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
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire d'ajout */}
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
            <CardTitle className="text-lg">Ajouter une Catégorie</CardTitle>
            <CardDescription>Créez une nouvelle catégorie pour vos produits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
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
          <Card className="shadow-sm border-blue-200 dark:border-blue-800">
            <CardHeader className="bg-blue-50 dark:bg-blue-900/30">
              <CardTitle className="text-lg text-blue-900 dark:text-blue-100">Modifier la Catégorie</CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">Modifiez les informations de la catégorie</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
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
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FolderOpen className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-lg font-medium mb-2">Aucune catégorie trouvée</p>
                <p className="text-sm mb-4">Commencez par créer votre première catégorie</p>
                <Button onClick={() => {}} variant="outline">
                  Créer une catégorie
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
