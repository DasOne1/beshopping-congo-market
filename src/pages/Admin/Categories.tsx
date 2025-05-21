import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Define the Category type with description as optional to match the existing data structure
interface Category {
  id: string;
  name: string;
  description?: string; // Make description optional 
  slug: string;
  image?: string;
  parentId?: string | null;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'cat_1',
      name: 'Electronics',
      slug: 'electronics',
      description: 'Explore the latest gadgets and electronics.',
      image: 'https://placehold.co/600x400/png',
      parentId: null,
    },
    {
      id: 'cat_2',
      name: 'Clothing',
      slug: 'clothing',
      description: 'Discover stylish clothing for all occasions.',
      image: 'https://placehold.co/600x400/png',
      parentId: null,
    },
  ]);
  
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    image: '',
    parentId: '',
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
    if (!newCategory.name) {
      toast({
        title: "Error",
        description: "Category name is required.",
        variant: "destructive",
      })
      return;
    }
    
    // Create new category with optional description
    const newCategoryObj: Category = {
      id: `cat_${Date.now()}`,
      name: newCategory.name,
      slug: newCategory.name.toLowerCase().replace(/\s+/g, '-'),
      description: newCategory.description || '', // Provide empty string as fallback
      image: newCategory.image || '',
      parentId: newCategory.parentId || null,
    };
    
    // Make sure we're using the correct type when updating state
    setCategories([...categories, newCategoryObj]);
    setNewCategory({ name: '', description: '', image: '', parentId: '' });
    toast({
      title: "Success",
      description: "Category added successfully.",
    })
  };
  
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };
  
  const handleUpdateCategory = () => {
    if (!editingCategory?.name) {
      toast({
        title: "Error",
        description: "Category name is required.",
        variant: "destructive",
      })
      return;
    }
    
    setCategories(categories.map(cat =>
      cat.id === editingCategory.id ? editingCategory : cat
    ));
    setEditingCategory(null);
    toast({
      title: "Success",
      description: "Category updated successfully.",
    })
  };
  
  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(cat => cat.id !== id));
    toast({
      title: "Success",
      description: "Category deleted successfully.",
    })
  };
  
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Categories</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Category Form */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-3">Add Category</h2>
          <Input
            type="text"
            name="name"
            placeholder="Category Name"
            value={newCategory.name}
            onChange={handleInputChange}
            className="mb-2"
          />
          <Textarea
            name="description"
            placeholder="Description"
            value={newCategory.description}
            onChange={handleInputChange}
            className="mb-2"
          />
          <Input
            type="text"
            name="image"
            placeholder="Image URL"
            value={newCategory.image}
            onChange={handleInputChange}
            className="mb-2"
          />
          <Input
            type="text"
            name="parentId"
            placeholder="Parent Category ID (optional)"
            value={newCategory.parentId}
            onChange={handleInputChange}
            className="mb-3"
          />
          <Button onClick={handleAddCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
        
        {/* Edit Category Form */}
        {editingCategory && (
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-3">Edit Category</h2>
            <Input
              type="text"
              name="name"
              placeholder="Category Name"
              value={editingCategory.name}
              onChange={handleEditInputChange}
              className="mb-2"
            />
            <Textarea
              name="description"
              placeholder="Description"
              value={editingCategory.description || ''}
              onChange={handleEditInputChange}
              className="mb-2"
            />
            <Input
              type="text"
              name="image"
              placeholder="Image URL"
              value={editingCategory.image || ''}
              onChange={handleEditInputChange}
              className="mb-2"
            />
            <Input
              type="text"
              name="parentId"
              placeholder="Parent Category ID (optional)"
              value={editingCategory.parentId || ''}
              onChange={handleEditInputChange}
              className="mb-3"
            />
            <Button onClick={handleUpdateCategory}>
              <Edit className="mr-2 h-4 w-4" />
              Update Category
            </Button>
          </div>
        )}
      </div>
      
      <Separator className="my-6" />
      
      {/* Categories List */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <Table>
          <TableCaption>A list of your categories.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Parent ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-16 h-12 object-cover rounded" />
                  ) : (
                    'No Image'
                  )}
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.slug}</TableCell>
                <TableCell>{category.parentId || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="ml-2"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Categories;
