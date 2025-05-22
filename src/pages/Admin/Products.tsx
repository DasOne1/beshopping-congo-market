
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { mockCategories } from '@/data/mockData';
import { ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';

// Define the Product interface for admin usage
interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  stock: number;
  status: 'active' | 'inactive';
  images: string[];
  variants?: {
    colors?: string[];
    sizes?: string[];
  };
  popular?: number; // For sorting in dashboard
  discount?: number; // For display
}

const Products = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'prod_1',
      name: 'Smartphone X',
      description: 'Latest smartphone with amazing features',
      category: 'Electronics',
      originalPrice: 999,
      discountedPrice: 899,
      stock: 50,
      status: 'active',
      images: ['https://placehold.co/600x400/png'],
      variants: {
        colors: ['Black', 'White', 'Blue'],
        sizes: []
      },
      popular: 10,
      discount: 10
    },
    {
      id: 'prod_2',
      name: 'Designer T-Shirt',
      description: 'Premium cotton t-shirt',
      category: 'Clothing',
      originalPrice: 49.99,
      discountedPrice: 39.99,
      stock: 100,
      status: 'active',
      images: ['https://placehold.co/600x400/png'],
      variants: {
        colors: ['Red', 'Green', 'Blue'],
        sizes: ['S', 'M', 'L', 'XL']
      },
      popular: 8,
      discount: 20
    }
  ]);
  
  const [categories, setCategories] = useState(mockCategories);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    price: '',
  });
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    description: '',
    category: '',
    originalPrice: 0,
    discountedPrice: 0,
    stock: 0,
    status: 'active',
    images: [],
    variants: {
      colors: [],
      sizes: [],
    },
    popular: 0,
    discount: 0
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newImage, setNewImage] = useState('');

  // Load products from localStorage on component mount
  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
    
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  // Store products in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      setFilters((prev) => ({
        ...prev,
        category: value !== 'all' ? value : '',
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const handleStatusChange = (checked: boolean) => {
    setNewProduct((prev) => ({
      ...prev,
      status: checked ? 'active' : 'inactive',
    }));
  };

  const handleAddImage = () => {
    if (newImage) {
      setNewProduct((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }));
      setNewImage('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setNewProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    // Generate a unique ID
    const productId = `prod_${Date.now()}`;
    
    // Calculate discount percentage if both prices are set
    let discountPercentage = 0;
    if (newProduct.originalPrice > 0 && newProduct.discountedPrice > 0) {
      discountPercentage = Math.round(((newProduct.originalPrice - newProduct.discountedPrice) / newProduct.originalPrice) * 100);
    }
    
    const productToAdd: Product = {
      id: productId,
      name: newProduct.name,
      description: newProduct.description,
      category: newProduct.category,
      originalPrice: newProduct.originalPrice,
      discountedPrice: newProduct.discountedPrice,
      stock: newProduct.stock,
      status: newProduct.status,
      images: newProduct.images.length > 0 ? newProduct.images : ['https://placehold.co/600x400/png'],
      variants: newProduct.variants,
      popular: 0, // New products start with 0 popularity
      discount: discountPercentage
    };
    
    setProducts((prev) => [...prev, productToAdd]);
    setIsAdding(false);
    setNewProduct({
      id: '',
      name: '',
      description: '',
      category: '',
      originalPrice: 0,
      discountedPrice: 0,
      stock: 0,
      status: 'active',
      images: [],
      variants: {
        colors: [],
        sizes: [],
      },
      popular: 0,
      discount: 0
    });
    toast({
      title: "Success",
      description: "Product added successfully"
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    // Calculate discount percentage if both prices are set
    let discountPercentage = 0;
    if (editingProduct.originalPrice > 0 && editingProduct.discountedPrice > 0) {
      discountPercentage = Math.round(((editingProduct.originalPrice - editingProduct.discountedPrice) / editingProduct.originalPrice) * 100);
    }

    const updatedProduct = {
      ...editingProduct,
      discount: discountPercentage
    };

    setProducts((prev) =>
      prev.map((product) =>
        product.id === editingProduct.id ? updatedProduct : product
      )
    );
    setEditingProduct(null);
    toast({
      title: "Success",
      description: "Product updated successfully"
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
    toast({
      title: "Success",
      description: "Product deleted successfully"
    });
  };

  // Filtered products calculation
  const filteredProducts = products.filter((product) => {
    // Apply filters
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesStatus = !filters.status || product.status === filters.status;
    const matchesPrice = !filters.price || (
      (filters.price === 'under50' && (product.discountedPrice || product.originalPrice) < 50) ||
      (filters.price === '50to100' && (product.discountedPrice || product.originalPrice) >= 50 && (product.discountedPrice || product.originalPrice) <= 100) ||
      (filters.price === 'over100' && (product.discountedPrice || product.originalPrice) > 100)
    );

    // Apply search
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
  });

  return (
    <AdminLayout>
      <div className="container py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearchChange}
          />
          <Select onValueChange={(value) => handleFilterChange({ target: { name: 'category', value } })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => handleFilterChange({ target: { name: 'status', value } })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => handleFilterChange({ target: { name: 'price', value } })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under50">Under $50</SelectItem>
              <SelectItem value="50to100">$50 - $100</SelectItem>
              <SelectItem value="over100">Over $100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add Product Form */}
        {isAdding && (
          <div className="mb-6 p-4 border rounded-md">
            <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => handleInputChange({ target: { name: 'category', value } })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="originalPrice">Original Price</Label>
                <Input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={newProduct.originalPrice}
                  onChange={handleNumberInputChange}
                />
              </div>
              <div>
                <Label htmlFor="discountedPrice">Discounted Price</Label>
                <Input
                  type="number"
                  id="discountedPrice"
                  name="discountedPrice"
                  value={newProduct.discountedPrice}
                  onChange={handleNumberInputChange}
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock</Label>
                <Input
                  type="number"
                  id="stock"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleNumberInputChange}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="status"
                    checked={newProduct.status === 'active'}
                    onCheckedChange={handleStatusChange}
                  />
                  <span>{newProduct.status}</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="mt-4">
              <Label>Images</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Image URL"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                />
                <Button type="button" onClick={handleAddImage}>
                  Add Image
                </Button>
              </div>
              <div className="flex mt-2 space-x-2">
                {newProduct.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product Image ${index}`}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </div>
          </div>
        )}

        {/* Product Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${product.discountedPrice || product.originalPrice}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.status}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-background p-6 rounded-md max-w-md w-full">
              <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editName">Name</Label>
                  <Input
                    type="text"
                    id="editName"
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editCategory">Category</Label>
                  <Select value={editingProduct.category} onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editOriginalPrice">Original Price</Label>
                  <Input
                    type="number"
                    id="editOriginalPrice"
                    value={editingProduct.originalPrice}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, originalPrice: parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editDiscountedPrice">Discounted Price</Label>
                  <Input
                    type="number"
                    id="editDiscountedPrice"
                    value={editingProduct.discountedPrice}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, discountedPrice: parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editStock">Stock</Label>
                  <Input
                    type="number"
                    id="editStock"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="editStatus">Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="editStatus"
                      checked={editingProduct.status === 'active'}
                      onCheckedChange={(checked) =>
                        setEditingProduct({
                          ...editingProduct,
                          status: checked ? 'active' : 'inactive',
                        })
                      }
                    />
                    <span>{editingProduct.status}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="editDescription">Description</Label>
                <Textarea
                  id="editDescription"
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                />
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingProduct(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateProduct}>Update Product</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Products;
