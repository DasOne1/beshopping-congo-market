
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { Plus, MoreVertical, PenLine, Trash2, Folder } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { mockCategories } from '@/data/mockData';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
}

interface SubCategory extends Category {
  parentId: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('categories');
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: ''
  });
  
  useEffect(() => {
    // Extract main categories and subcategories from the mock data
    const mainCategories = mockCategories.filter(cat => !cat.parentId);
    const subCats = mockCategories.filter(cat => cat.parentId) as SubCategory[];
    
    setCategories(mainCategories);
    setSubCategories(subCats);
  }, []);
  
  const handleDialogOpen = (isEdit: boolean, category?: Category) => {
    setIsEditMode(isEdit);
    
    if (isEdit && category) {
      setCurrentCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        parentId: (category as SubCategory).parentId || ''
      });
    } else {
      setCurrentCategory(null);
      setFormData({
        name: '',
        description: '',
        parentId: ''
      });
    }
    
    setDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    
    if (activeTab === 'subcategories' && !formData.parentId) {
      toast.error("Parent category is required for subcategories");
      return;
    }
    
    try {
      if (isEditMode && currentCategory) {
        if (activeTab === 'categories') {
          // Update category
          setCategories(prev => 
            prev.map(cat => cat.id === currentCategory.id 
              ? { ...cat, name: formData.name, description: formData.description }
              : cat
            )
          );
        } else {
          // Update subcategory
          setSubCategories(prev => 
            prev.map(cat => cat.id === currentCategory.id 
              ? { ...cat, name: formData.name, description: formData.description, parentId: formData.parentId }
              : cat
            )
          );
        }
        toast.success(`${formData.name} updated successfully`);
      } else {
        // Create new category/subcategory
        const newId = Date.now().toString();
        
        if (activeTab === 'categories') {
          const newCategory: Category = {
            id: newId,
            name: formData.name,
            description: formData.description
          };
          setCategories(prev => [...prev, newCategory]);
        } else {
          const newSubCategory: SubCategory = {
            id: newId,
            name: formData.name,
            description: formData.description,
            parentId: formData.parentId
          };
          setSubCategories(prev => [...prev, newSubCategory]);
        }
        toast.success(`${formData.name} created successfully`);
      }
      
      setDialogOpen(false);
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };
  
  const handleDelete = (id: string) => {
    try {
      if (activeTab === 'categories') {
        // Check if there are subcategories linked to this category
        const linkedSubcats = subCategories.filter(subcat => subcat.parentId === id);
        if (linkedSubcats.length > 0) {
          toast.error("Cannot delete: This category has subcategories linked to it");
          return;
        }
        
        setCategories(prev => prev.filter(cat => cat.id !== id));
      } else {
        setSubCategories(prev => prev.filter(cat => cat.id !== id));
      }
      toast.success("Deleted successfully");
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };
  
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Categories</h1>
            <p className="text-muted-foreground">Manage categories and subcategories</p>
          </div>
          <Button onClick={() => handleDialogOpen(false)}>
            <Plus size={16} className="mr-1" /> Add Category
          </Button>
        </div>
        
        <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <Tabs defaultValue="categories" onValueChange={setActiveTab} value={activeTab}>
              <TabsList>
                <TabsTrigger value="categories">
                  Categories
                </TabsTrigger>
                <TabsTrigger value="subcategories">
                  Subcategories
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="categories" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Subcategories</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No categories found. Add your first category.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => {
                      const linkedSubcats = subCategories.filter(
                        subcat => subcat.parentId === category.id
                      );
                      
                      return (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>{category.description}</TableCell>
                          <TableCell>{linkedSubcats.length}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical size={16} />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleDialogOpen(true, category)}>
                                  <PenLine size={14} className="mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(category.id)} className="text-destructive focus:text-destructive">
                                  <Trash2 size={14} className="mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="subcategories" className="space-y-4">
              <div className="flex justify-end">
                <Button size="sm" onClick={() => handleDialogOpen(false)}>
                  <Plus size={16} className="mr-1" /> Add Subcategory
                </Button>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Parent Category</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No subcategories found. Add your first subcategory.
                      </TableCell>
                    </TableRow>
                  ) : (
                    subCategories.map((subcat) => {
                      const parentCategory = categories.find(cat => cat.id === subcat.parentId);
                      
                      return (
                        <TableRow key={subcat.id}>
                          <TableCell className="font-medium">{subcat.name}</TableCell>
                          <TableCell>{subcat.description}</TableCell>
                          <TableCell>{parentCategory ? parentCategory.name : "Unknown"}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical size={16} />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleDialogOpen(true, subcat)}>
                                  <PenLine size={14} className="mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDelete(subcat.id)} className="text-destructive focus:text-destructive">
                                  <Trash2 size={14} className="mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </CardContent>
        </Card>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Edit' : 'Add New'} {activeTab === 'categories' ? 'Category' : 'Subcategory'}
              </DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? 'Make changes to your category details here.' 
                  : 'Add the details for the new category.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Category name" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Brief description" 
                />
              </div>
              
              {activeTab === 'subcategories' && (
                <div className="grid gap-2">
                  <Label htmlFor="parentId">Parent Category</Label>
                  <select 
                    id="parentId" 
                    name="parentId" 
                    value={formData.parentId} 
                    onChange={e => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select parent category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>
                {isEditMode ? 'Save Changes' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </AdminLayout>
  );
}
