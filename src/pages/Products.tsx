
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductFilters from '@/components/ProductFilters';
import ProductSkeleton from '@/components/ProductSkeleton';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Search, Grid, List, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useOfflinePageHandler } from '@/hooks/useOfflinePageHandler';
import OfflineConnectionPrompt from '@/components/OfflineConnectionPrompt';
import OptimizedSkeleton from '@/components/OptimizedSkeleton';

const Products = () => {
  const { products, isLoading } = useProducts();
  const { categories } = useCategories();
  const {
    showSkeleton,
    showConnectMessage,
    hasOfflineData,
    isOnline
  } = useOfflinePageHandler({
    pageName: 'products',
    requiredData: ['products', 'categories'],
    fallbackDelay: 7000
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Handle price range updates correctly
  const handlePriceRangeChange = (range: number[]) => {
    setPriceRange([range[0], range[1]]);
  };

  // Convert showSkeleton and showConnectMessage to boolean safely
  const shouldShowSkeleton = showSkeleton === true || showSkeleton === 'true';
  const shouldShowConnectMessage = showConnectMessage === true || showConnectMessage === 'true';

  // Show skeleton for offline/no data scenarios
  if (shouldShowSkeleton) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-20 md:pt-24">
          <OptimizedSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  // Show connection prompt for offline users without data
  if (shouldShowConnectMessage) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 pt-20 md:pt-24">
          <OfflineConnectionPrompt 
            message="Pour voir les produits, veuillez vous connecter à Internet."
          />
        </main>
        <Footer />
      </div>
    );
  }

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
      const matchesPrice = product.original_price >= priceRange[0] && product.original_price <= priceRange[1];
      const isVisible = product.is_visible !== false;
      
      return matchesSearch && matchesCategory && matchesPrice && isVisible;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.original_price - b.original_price;
        case 'price-desc':
          return b.original_price - a.original_price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 1000000]);
    setSortBy('name');
  };

  const hasActiveFilters = searchTerm || selectedCategory !== 'all' || priceRange[0] > 0 || priceRange[1] < 1000000;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-20 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <ProductFilters
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  priceRange={priceRange}
                  setPriceRange={handlePriceRangeChange}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  categories={categories}
                  onClearFilters={clearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Mobile Header */}
              <div className="lg:hidden mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher des produits..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Sheet open={showFilters} onOpenChange={setShowFilters}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon" className="relative">
                        <Filter className="h-4 w-4" />
                        {hasActiveFilters && (
                          <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                            !
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <div className="p-6">
                        <ProductFilters
                          searchTerm={searchTerm}
                          setSearchTerm={setSearchTerm}
                          selectedCategory={selectedCategory}
                          setSelectedCategory={setSelectedCategory}
                          priceRange={priceRange}
                          setPriceRange={handlePriceRangeChange}
                          sortBy={sortBy}
                          setSortBy={setSortBy}
                          categories={categories}
                          onClearFilters={clearFilters}
                          hasActiveFilters={hasActiveFilters}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Nos Produits
                  </h1>
                  <p className="text-muted-foreground">
                    {isLoading ? (
                      "Chargement des produits..."
                    ) : (
                      `${filteredProducts.length} produit${filteredProducts.length > 1 ? 's' : ''} trouvé${filteredProducts.length > 1 ? 's' : ''}`
                    )}
                    {!isOnline && hasOfflineData && (
                      <span className="ml-2 text-amber-600">(Données hors ligne)</span>
                    )}
                  </p>
                </div>
                
                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {searchTerm && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Recherche: "{searchTerm}"
                      <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-red-500">
                        ×
                      </button>
                    </Badge>
                  )}
                  {selectedCategory !== 'all' && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Catégorie: {categories.find(c => c.id === selectedCategory)?.name}
                      <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:text-red-500">
                        ×
                      </button>
                    </Badge>
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < 1000000) && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Prix: {priceRange[0].toLocaleString()}FC - {priceRange[1].toLocaleString()}FC
                      <button onClick={() => setPriceRange([0, 1000000])} className="ml-1 hover:text-red-500">
                        ×
                      </button>
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 px-2 text-xs"
                  >
                    Effacer tout
                  </Button>
                </div>
              )}

              {/* Products Grid */}
              {isLoading ? (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  <ProductSkeleton count={6} />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">Aucun produit trouvé</h3>
                  <p className="text-muted-foreground mb-4">
                    Essayez de modifier vos critères de recherche ou de filtrage.
                  </p>
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} variant="outline">
                      Effacer les filtres
                    </Button>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <ProductCard 
                        product={product} 
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <div className="pb-16 md:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default Products;
