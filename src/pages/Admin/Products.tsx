
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Plus, MoreVertical, PenLine, Trash2, Image as ImageIcon, Eye, Search } from 'lucide-react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { mockProducts, mockCategories } from '@/data/mockData';
import { Product } from '@/types';
import { toast } from 'sonner';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    originalPrice: 0,
    discountedPrice: 0,
    discount: 0,
    stock: 0,
    featured: false
  });
  
  useEffect(() => {
    setProducts(mockProducts);
  }, []);
  
  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDialogOpen = (isEdit: boolean, product?: Product) => {
    setIsEditMode(isEdit);
    
    if (isEdit && product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice || 0,
        discount: product.discount || 0,
        stock: product.stock,
        featured: product.featured || false
      });
      setImageUrls(product.images);
    } else {
      setCurrentProduct(null);
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        originalPrice: 0,
        discountedPrice: 0,
        discount: 0,
        stock: 0,
        featured: false
      });
      setImageUrls(['https://via.placeholder.com/300']);
    }
    
    setDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (name === 'originalPrice' || name === 'discountedPrice' || name === 'discount' || name === 'stock') {
      const numValue = name === 'discount' ? parseInt(value) : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
      
      // Auto-calculate discounted price when original price and discount change
      if (name === 'originalPrice' || name === 'discount') {
        const originalPrice = name === 'originalPrice' 
          ? parseFloat(value) || 0 
          : formData.originalPrice;
        const discount = name === 'discount' 
          ? parseInt(value) || 0 
          : formData.discount;
        
        if (originalPrice > 0 && discount > 0) {
          const calculatedPrice = originalPrice * (1 - discount/100);
          setFormData(prev => ({ ...prev, discountedPrice: Math.round(calculatedPrice) }));
        }
      }
      
      // Auto-calculate discount when original price and discounted price change
      if (name === 'originalPrice' || name === 'discountedPrice') {
        const originalPrice = name === 'originalPrice' 
          ? parseFloat(value) || 0 
          : formData.originalPrice;
        const discountedPrice = name === 'discountedPrice' 
          ? parseFloat(value) || 0 
          : formData.discountedPrice;
          
        if (originalPrice > 0 && discountedPrice > 0 && discountedPrice < originalPrice) {
          const calculatedDiscount = ((originalPrice - discountedPrice) / originalPrice) * 100;
          setFormData(prev => ({ ...prev, discount: Math.round(calculatedDiscount) }));
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, featured: checked }));
  };
  
  const handleAddImageUrl = () => {
    setImageUrls(prev => [...prev, 'https://via.placeholder.com/300']);
  };
  
  const handleImageUrlChange = (index: number, url: string) => {
    setImageUrls(prev => {
      const newUrls = [...prev];
      newUrls[index] = url;
      return newUrls;
    });
  };
  
  const handleRemoveImageUrl = (index: number) => {
    setImageUrls(prev => {
      if (prev.length <= 1) {
        return prev;
      }
      return prev.filter((_, i) => i !== index);
    });
  };
  
  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    
    if (!formData.categoryId) {
      toast.error("Category is required");
      return;
    }
    
    if (formData.originalPrice <= 0) {
      toast.error("Original price must be greater than 0");
      return;
    }
    
    try {
      const updatedProduct: Product = {
        id: isEditMode && currentProduct ? currentProduct.id : Date.now().toString(),
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        originalPrice: formData.originalPrice,
        stock: formData.stock,
        images: imageUrls.filter(url => url !== 'https://via.placeholder.com/300'),
        popular: isEditMode && currentProduct ? currentProduct.popular : 0
      };
      
      // Add optional fields
      if (formData.discountedPrice > 0 && formData.discountedPrice < formData.originalPrice) {
        updatedProduct.discountedPrice = formData.discountedPrice;
      }
      
      if (formData.discount > 0) {
        updatedProduct.discount = formData.discount;
      }
      
      if (formData.featured) {
        updatedProduct.featured = true;
      }
      
      if (isEditMode && currentProduct) {
        // Update existing product
        setProducts(prev => 
          prev.map(prod => prod.id === currentProduct.id ? updatedProduct : prod)
        );
        toast.success(`${formData.name} updated successfully`);
      } else {
        // Create new product
        setProducts(prev => [...prev, updatedProduct]);
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
      setProducts(prev => prev.filter(product => product.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };
  
  // Format price with thousands separator
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Button onClick={() => handleDialogOpen(false)}>
            <Plus size={16} className="mr-1" /> Add Product
          </Button>
        </div>
        
        <div className="flex items-center border rounded-md overflow-hidden">
          <div className="px-3 text-muted-foreground">
            <Search size={18} />
          </div>
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        
        <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Product Catalog</CardTitle>
            <CardDescription>
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => {
                      const category = mockCategories.find(cat => cat.id === product.categoryId);
                      const displayPrice = product.discountedPrice || product.originalPrice;
                      
                      return (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-md overflow-hidden">
                                <img 
                                  src={product.images[0] || "https://via.placeholder.com/150"} 
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                  {product.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {category?.name || "Uncategorized"}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{formatPrice(displayPrice)} FC</div>
                            {product.discountedPrice && (
                              <div className="text-xs text-muted-foreground line-through">
                                {formatPrice(product.originalPrice)} FC
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.stock > 0 ? "outline" : "secondary"}>
                              {product.stock} in stock
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {product.featured && (
                                <Badge variant="default" className="bg-primary">Featured</Badge>
                              )}
                              {product.discount && product.discount > 0 && (
                                <Badge variant="secondary">-{product.discount}%</Badge>
                              )}
                              {product.stock <= 0 && (
                                <Badge variant="destructive">Out of stock</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical size={16} />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => window.open(`/product/${product.id}`, '_blank')}
                                >
                                  <Eye size={14} className="mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDialogOpen(true, product)}>
                                  <PenLine size={14} className="mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(product.id)}
                                  className="text-destructive focus:text-destructive"
                                >
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
            </div>
          </CardContent>
        </Card>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Edit' : 'Add New'} Product
              </DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? 'Make changes to your product details here.' 
                  : 'Add the details for the new product.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Product name" 
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange} 
                    placeholder="Product description" 
                    className="min-h-[100px]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="categoryId">Category</Label>
                  <select 
                    id="categoryId" 
                    name="categoryId" 
                    value={formData.categoryId} 
                    onChange={handleInputChange}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select category</option>
                    {mockCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="originalPrice">Original Price (FC)</Label>
                    <Input 
                      type="number" 
                      id="originalPrice" 
                      name="originalPrice" 
                      value={formData.originalPrice} 
                      onChange={handleInputChange}
                      min="0"
                      step="1"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input 
                      type="number" 
                      id="discount" 
                      name="discount" 
                      value={formData.discount} 
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      step="1"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="discountedPrice">Discounted Price (FC)</Label>
                    <Input 
                      type="number" 
                      id="discountedPrice" 
                      name="discountedPrice" 
                      value={formData.discountedPrice} 
                      onChange={handleInputChange}
                      min="0"
                      step="1"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="stock">Stock</Label>
                    <Input 
                      type="number" 
                      id="stock" 
                      name="stock" 
                      value={formData.stock} 
                      onChange={handleInputChange}
                      min="0"
                      step="1"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="featured">Featured Product</Label>
                </div>
              </div>
              
              <div>
                <Label className="block mb-2">Product Images</Label>
                <div className="space-y-3">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={url}
                        onChange={e => handleImageUrlChange(index, e.target.value)}
                        placeholder="Image URL"
                      />
                      <Button 
                        variant="ghost" 
                        size="icon"
                        type="button"
                        onClick={() => handleRemoveImageUrl(index)}
                        disabled={imageUrls.length <= 1}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddImageUrl}
                    className="w-full"
                  >
                    <ImageIcon size={16} className="mr-1" />
                    Add Image
                  </Button>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="aspect-square rounded-md border overflow-hidden">
                      <img
                        src={url}
                        alt={`Product image ${index + 1}`}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+URL';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave}>
                {isEditMode ? 'Save Changes' : 'Create Product'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </AdminLayout>
  );
}
