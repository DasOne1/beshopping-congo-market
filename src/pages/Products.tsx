
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingBag, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import FilterSidebar from '@/components/FilterSidebar';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useSearchParams } from 'react-router-dom';

const Products = () => {
  const [searchParams] = useSearchParams();
  const { products, isLoading: productsLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [appliedFilters, setAppliedFilters] = useState({
    category: '',
    priceRange: [0, 10000]
  });

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      setAppliedFilters(prev => ({ ...prev, category: categoryFromUrl }));
    }
  }, [searchParams]);

  const isLoading = productsLoading || categoriesLoading;

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !appliedFilters.category || product.category_id === appliedFilters.category;
      const productPrice = product.discounted_price || product.original_price;
      const matchesPrice = productPrice >= appliedFilters.priceRange[0] && productPrice <= appliedFilters.priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.discounted_price || a.original_price) - (b.discounted_price || b.original_price);
        case 'price-high':
          return (b.discounted_price || b.original_price) - (a.discounted_price || a.original_price);
        case 'popular':
          return b.popular - a.popular;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const handleApplyFilters = () => {
    setAppliedFilters({
      category: selectedCategory,
      priceRange: priceRange
    });
    setIsFilterOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 10000]);
    setAppliedFilters({
      category: '',
      priceRange: [0, 10000]
    });
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Nos Produits
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez notre collection complète de produits de qualité
          </p>
        </motion.div>

        {/* Fixed Search and Controls Bar */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border mb-6 pb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher des produits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nom (A-Z)</SelectItem>
                <SelectItem value="price-low">Prix croissant</SelectItem>
                <SelectItem value="price-high">Prix décroissant</SelectItem>
                <SelectItem value="popular">Plus populaire</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
              
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
        </div>

        {/* Active Filters Display */}
        {(appliedFilters.category || appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 10000) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {appliedFilters.category && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                Catégorie: {categories.find(cat => cat.id === appliedFilters.category)?.name}
                <button onClick={() => setAppliedFilters(prev => ({ ...prev, category: '' }))}>×</button>
              </div>
            )}
            {(appliedFilters.priceRange[0] > 0 || appliedFilters.priceRange[1] < 10000) && (
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                Prix: {appliedFilters.priceRange[0]} - {appliedFilters.priceRange[1]} FC
                <button onClick={() => setAppliedFilters(prev => ({ ...prev, priceRange: [0, 10000] }))}>×</button>
              </div>
            )}
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
            <ProductSkeleton count={8} />
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * (index % 8) }}
              >
                <ProductCard product={product} viewMode={viewMode} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />

      <Footer />
    </div>
  );
};

export default Products;
