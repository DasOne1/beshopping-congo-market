import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, Grid3X3, List, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import ProductFilters from '@/components/ProductFilters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useProducts, Product } from '@/hooks/useProducts';
import { useCategories, Category } from '@/hooks/useCategories';
import { useAnalytics } from '@/hooks/useAnalytics';

const Products = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get('category');
  const searchQuery = searchParams.get('search') || '';
  
  const { products, isLoading: productsLoading } = useProducts();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { trackEvent } = useAnalytics();

  const [searchTerm, setSearchTerm] = useState(searchQuery);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState(selectedCategoryId || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const itemsPerPage = 12;

  // Ref pour la recherche
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedCategoryId) {
      setSelectedCategory(selectedCategoryId);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (searchQuery) {
      setSearchTerm(searchQuery);
      setIsSearchExpanded(true);
    }
  }, [searchQuery]);

  // Gérer les clics en dehors de la recherche
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchExpanded(false);
      }
    };

    if (isSearchExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchExpanded]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    
    const price = product.discounted_price || product.original_price;
    const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
    
    // Include both active and inactive products in the list
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
    setIsSearchExpanded(false);
    navigate('/products');
  };

  const handleProductClick = (productId: string) => {
    trackEvent.mutate({
      event_type: 'view_product',
      product_id: productId,
      session_id: sessionStorage.getItem('session_id') || 'anonymous'
    });
  };

  const handleSearchIconClick = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const isLoading = productsLoading || categoriesLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 pt-20 md:pt-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Nos Produits</h1>
          <p className="text-muted-foreground">
            Découvrez notre sélection de produits de qualité
          </p>
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
              
              {/* Barre de recherche avec overlay centré */}
              <div className="relative" ref={searchRef}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSearchIconClick}
                  className="p-2"
                >
                  <Search className="h-4 w-4" />
                </Button>
                
                {/* Overlay de recherche centré */}
                {isSearchExpanded && (
                  <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/20" onClick={() => setIsSearchExpanded(false)} />
                    
                    {/* Search overlay */}
                    <div className="relative bg-background border rounded-lg shadow-xl p-4 mx-4 w-full max-w-md">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Rechercher des produits..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="border-0 focus-visible:ring-0 px-0"
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsSearchExpanded(false)}
                          className="p-1 h-6 w-6"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              
              </div>
              
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
      
      <Footer />
    </div>
  );
};

export default Products;
