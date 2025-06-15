
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Package, Users, FolderOpen } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { useCustomers } from '@/hooks/useCustomers';
import CategoriesSection from '@/components/admin/catalog/CategoriesSection';
import ProductsSection from '@/components/admin/catalog/ProductsSection';
import CustomersSection from '@/components/admin/catalog/CustomersSection';

const AdminCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { products, isLoading: productsLoading } = useProducts();
  const { customers, isLoading: customersLoading } = useCustomers();

  const stats = {
    categories: categories?.length || 0,
    products: products?.length || 0,
    customers: customers?.length || 0,
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="space-y-4 p-4 pb-24 md:pb-6 max-w-full">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
              Catalogue
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              Gérez vos catégories, produits et clients
            </p>
          </div>
          
          {/* Search */}
          <div className="w-full lg:w-auto lg:min-w-[300px] lg:max-w-[400px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium truncate">Catégories</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.categories}</div>
              <p className="text-xs text-muted-foreground">
                Total des catégories
              </p>
            </CardContent>
          </Card>
          
          <Card className="min-w-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium truncate">Produits</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.products}</div>
              <p className="text-xs text-muted-foreground">
                Produits en stock
              </p>
            </CardContent>
          </Card>
          
          <Card className="min-w-0 sm:col-span-2 lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium truncate">Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
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
        <div className="w-full max-w-full">
          <Tabs defaultValue="categories" className="space-y-4 w-full">
            <div className="w-full overflow-x-auto">
              <TabsList className="grid w-full grid-cols-3 min-w-[300px] lg:min-w-0">
                <TabsTrigger value="categories" className="text-xs sm:text-sm">Catégories</TabsTrigger>
                <TabsTrigger value="products" className="text-xs sm:text-sm">Produits</TabsTrigger>
                <TabsTrigger value="customers" className="text-xs sm:text-sm">Clients</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="categories" className="w-full max-w-full overflow-hidden">
              <CategoriesSection searchTerm={searchTerm} />
            </TabsContent>
            
            <TabsContent value="products" className="w-full max-w-full overflow-hidden">
              <ProductsSection searchTerm={searchTerm} />
            </TabsContent>
            
            <TabsContent value="customers" className="w-full max-w-full overflow-hidden">
              <CustomersSection searchTerm={searchTerm} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminCatalog;
