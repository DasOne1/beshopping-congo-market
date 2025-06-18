import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Package, Users, FolderOpen, Eye, EyeOff } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { useCustomers } from '@/hooks/useCustomers';
import CategoriesSection from '@/components/admin/catalog/CategoriesSection';
import ProductsSection from '@/components/admin/catalog/ProductsSection';
import CustomersSection from '@/components/admin/catalog/CustomersSection';

const AdminCatalog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { products, isLoading: productsLoading } = useProducts({
    includeHidden: true,
    includeInactive: true
  });
  const { customers, isLoading: customersLoading } = useCustomers();

  // Filtrer les éléments selon leur visibilité
  const visibleCategories = categories?.filter(cat => cat.is_visible) || [];
  const hiddenCategories = categories?.filter(cat => !cat.is_visible) || [];
  const visibleProducts = products?.filter(prod => prod.is_visible) || [];
  const hiddenProducts = products?.filter(prod => !prod.is_visible) || [];

  const stats = {
    categories: visibleCategories.length,
    products: visibleProducts.length,
    customers: customers?.length || 0,
    hiddenCategories: hiddenCategories.length,
    hiddenProducts: hiddenProducts.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Catalogue
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez vos catégories, produits et clients
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Hidden Items Button */}
          {(stats.hiddenCategories > 0 || stats.hiddenProducts > 0) && (
            <Button
              variant="outline"
              onClick={() => navigate('/admin/catalog/hidden')}
              className="flex items-center gap-2"
            >
              <EyeOff className="h-4 w-4" />
              Éléments masqués
              <span className="ml-1 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                {stats.hiddenCategories + stats.hiddenProducts}
              </span>
            </Button>
          )}
          
          {/* Search */}
          <div className="relative w-full sm:w-auto sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catégories</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
            <p className="text-xs text-muted-foreground">
              Catégories visibles
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.products}</div>
            <p className="text-xs text-muted-foreground">
              Produits visibles
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers}</div>
            <p className="text-xs text-muted-foreground">
              Clients enregistrés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="products">Produits</TabsTrigger>
          <TabsTrigger value="customers">Clients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories">
          <CategoriesSection searchTerm={searchTerm} />
        </TabsContent>
        
        <TabsContent value="products">
          <ProductsSection searchTerm={searchTerm} />
        </TabsContent>
        
        <TabsContent value="customers">
          <CustomersSection searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCatalog;
