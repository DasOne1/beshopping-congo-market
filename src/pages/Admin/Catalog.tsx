
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
}

interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  parentId?: string | null;
}

export default function Catalog() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<Product[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      const parsedProducts = JSON.parse(storedProducts);
      setProducts(parsedProducts);
      
      // Find low stock items (less than 10)
      setInventoryAlerts(parsedProducts.filter((product: Product) => 
        product.stock < 10 && product.status === 'active'
      ));
    }
    
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    toast({
      title: "Success",
      description: "Product deleted successfully"
    });
  };

  const handleDeleteCategory = (id: string) => {
    const updatedCategories = categories.filter(category => category.id !== id);
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    toast({
      title: "Success",
      description: "Category deleted successfully"
    });
  };

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Package className="mr-2 h-6 w-6" />
              Catalog
            </h1>
            <p className="text-muted-foreground">Manage products, categories and inventory</p>
          </div>
          
          <Button onClick={() => navigate('/admin/products')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
        
        <Tabs defaultValue="products">
          <TabsList className="mb-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your store products</CardDescription>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No products found</p>
                    <Button onClick={() => navigate('/admin/products')} variant="outline" className="mt-4">Add Product</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.slice(0, 5).map((product) => (
                      <div 
                        key={product.id}
                        className="flex justify-between items-center p-3 rounded-lg bg-background border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                            <img 
                              src={product.images[0]} 
                              alt={product.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatPrice(product.discountedPrice || product.originalPrice)} CDF
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/admin/products`)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {products.length > 5 && (
                      <Button onClick={() => navigate('/admin/products')} variant="outline" className="w-full mt-2">
                        View All ({products.length}) Products
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <div className="flex justify-between">
                  <div>
                    <CardTitle>Categories</CardTitle>
                    <CardDescription>Manage your product categories</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => navigate('/admin/categories')}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Category
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No categories found</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/categories')}>
                      Add Category
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div 
                        key={category.id}
                        className="flex justify-between items-center p-3 rounded-lg bg-background border"
                      >
                        <div className="flex items-center gap-3">
                          {category.image && (
                            <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                              <img 
                                src={category.image} 
                                alt={category.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{category.name}</div>
                            {category.description && (
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {category.description}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/admin/categories`)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>Manage your product stock</CardDescription>
              </CardHeader>
              <CardContent>
                {inventoryAlerts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>No inventory alerts</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/products')}>
                      Update Stock
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Low Stock Alerts</h3>
                    {inventoryAlerts.map((product) => (
                      <div 
                        key={product.id}
                        className="flex justify-between items-center p-3 rounded-lg bg-background border border-yellow-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                            <img 
                              src={product.images[0]} 
                              alt={product.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-red-500 font-medium">
                              Only {product.stock} items left!
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/admin/products`)}>
                          Update Stock
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
