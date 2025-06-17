
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Grid3X3, List, Filter, Search, RefreshCw } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import ProductFilters from '@/components/ProductFilters';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useProducts } from '@/hooks/useProducts';
import { useCachedCategories } from '@/hooks/useCachedCategories';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Product } from '@/types';

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';
  
  const { products, isLoading: productsLoading, refetch } = useProducts();
  const { categories, isLoading: categoriesLoading, getAllCategoryIds } = useCachedCategories();
  const { trackEvent } = useAnalytics();

  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState(selectedCategoryId || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const itemsPerPage = 12;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      console.log('Produits rafraîchis manuellement');
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    if (selectedCategoryId) {
      setSelectedCategory(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [searchQuery]);

  const filteredProducts = (products as Product[]).filter(product => {
    if (!product.is_visible || product.status !== 'active') {
      return false;
    }

    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    // Amélioration du filtrage par catégorie pour inclure les sous-catégories
    let matchesCategory = selectedCategory === 'all';
    if (!matchesCategory && selectedCategory) {
      // Obtenir tous les IDs de catégories (parent + enfants)
      const categoryIds = getAllCategoryIds(selectedCategory);
      
      // Vérifier si le produit appartient à la catégorie sélectionnée ou ses sous-catégories
      matchesCategory = categoryIds.includes(product.category_id || '') || 
                      (product.subcategory_id && categoryIds.includes(product.subcategory_id)) ||
                      product.category_id === selectedCategory ||
                      product.subcategory_id === selectedCategory;
    }
    
    const price = product.discounted_price || product.original_price;
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.discounted_price || a.original_price) - (b.discounted_price || b.original_price);
      case 'price-high':
        return (b.discounted_price || b.original_price) - (a.discounted_price || a.original_price);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'popular':
        return (b.popular || 0) - (a.popular || 0);
      default:
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 1000000]);
    setSortBy('newest');
    setCurrentPage(1);
    navigate('/products');
  };

  const handleProductClick = (productId: string) => {
    trackEvent.mutate({
      event_type: 'view_product',
      product_id: productId,
      session_id: sessionStorage.getItem('session_id') || 'anonymous'
    });
  };

  const isLoading = productsLoading || categoriesLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pt-20 md:pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Nos Produits</h1>
              <p className="text-muted-foreground">
                Découvrez notre sélection de produits de qualité
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Sticky Controls */}
        <div className="sticky top-16 md:top-20 z-40 bg-background/95 backdrop-blur-sm border-b pb-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFiltersOpen(true)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filtres
              </Button>
              
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {isLoading ? 'Chargement...' : `${sortedProducts.length} produit(s)`}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="sort" className="text-sm">Trier par:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Plus récent</SelectItem>
                    <SelectItem value="popular">Popularité</SelectItem>
                    <SelectItem value="price-low">Prix croissant</SelectItem>
                    <SelectItem value="price-high">Prix décroissant</SelectItem>
                    <SelectItem value="name">Nom A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {isLoading ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            <ProductSkeleton count={12} />
          </div>
        ) : paginatedProducts.length > 0 ? (
          <>
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "space-y-4"
            }>
              {paginatedProducts.map(product => (
                <div key={product.id} onClick={() => handleProductClick(product.id)}>
                  <ProductCard 
                    product={product} 
                    viewMode={viewMode}
                    showAllAttributes={false}
                  />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNumber)}
                            isActive={currentPage === pageNumber}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Essayez de modifier vos critères de recherche ou explorez d'autres catégories.
            </p>
            <Button onClick={clearFilters}>
              Effacer les filtres
            </Button>
          </div>
        )}

        {/* Filters Sidebar */}
        <ProductFilters
          isOpen={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          isLoading={isLoading}
          onClearFilters={clearFilters}
        />
      </main>
      
      <div className="pb-16 md:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default Products;
