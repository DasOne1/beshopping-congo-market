
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Package, Users, FolderOpen, EyeOff, Eye } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { useCustomers } from '@/hooks/useCustomers';
import CategoriesSection from '@/components/admin/catalog/CategoriesSection';
import ProductsSection from '@/components/admin/catalog/ProductsSection';
import CustomersSection from '@/components/admin/catalog/CustomersSection';

const AdminCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showHidden, setShowHidden] = useState(false);
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { products, isLoading: productsLoading } = useProducts();
  const { customers, isLoading: customersLoading } = useCustomers();

  const stats = {
    categories: categories?.length || 0,
    products: products?.length || 0,
    customers: customers?.length || 0,
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
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Bouton pour voir les éléments masqués */}
          <Button
            variant={showHidden ? "default" : "outline"}
            onClick={() => setShowHidden(!showHidden)}
            className="flex items-center gap-2"
          >
            {showHidden ? (
              <>
                <Eye className="h-4 w-4" />
                Voir tout
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                Voir masqués
              </>
            )}
          </Button>
          
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
              Total des catégories
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
              Produits en stock
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
          <CategoriesSection searchTerm={searchTerm} showHidden={showHidden} />
        </TabsContent>
        
        <TabsContent value="products">
          <ProductsSection searchTerm={searchTerm} showHidden={showHidden} />
        </TabsContent>
        
        <TabsContent value="customers">
          <CustomersSection searchTerm={searchTerm} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminCatalog;
