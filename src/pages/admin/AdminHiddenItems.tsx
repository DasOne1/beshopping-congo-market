import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Package, FolderOpen, ArrowLeft, Eye } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import CategoriesSection from '@/components/admin/catalog/CategoriesSection';
import ProductsSection from '@/components/admin/catalog/ProductsSection';

const AdminHiddenItems = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { products, isLoading: productsLoading } = useProducts({
    includeHidden: true,
    includeInactive: true
  });

  // Filtrer seulement les éléments masqués
  const hiddenCategories = categories?.filter(cat => !cat.is_visible) || [];
  const hiddenProducts = products?.filter(prod => !prod.is_visible) || [];

  const stats = {
    hiddenCategories: hiddenCategories.length,
    hiddenProducts: hiddenProducts.length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/catalog')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au catalogue
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Éléments masqués
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez les catégories et produits masqués
            </p>
          </div>
        </div>
        
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catégories masquées</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hiddenCategories}</div>
            <p className="text-xs text-muted-foreground">
              Catégories non visibles
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produits masqués</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hiddenProducts}</div>
            <p className="text-xs text-muted-foreground">
              Produits non visibles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">
            Catégories masquées ({stats.hiddenCategories})
          </TabsTrigger>
          <TabsTrigger value="products">
            Produits masqués ({stats.hiddenProducts})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories">
          <CategoriesSection searchTerm={searchTerm} showHidden={true} />
        </TabsContent>
        
        <TabsContent value="products">
          <ProductsSection searchTerm={searchTerm} showHidden={true} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminHiddenItems; 