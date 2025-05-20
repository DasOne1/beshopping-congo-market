import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Filter, X, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { mockProducts, mockCategories } from '@/data/mockData';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

const Products = () => {
  const location = useLocation();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSortOption, setSelectedSortOption] = useState('newest');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
  const [inStockOnly, setInStockOnly] = useState(false);
  
  // Extract query parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    const category = params.get('category');
    if (category && !selectedCategories.includes(category)) {
      setSelectedCategories(prev => [...prev, category]);
    }
    
    const tag = params.get('tag');
    if (tag) {
      setSearchQuery(tag);
    }
  }, [location.search]);
  
  // Apply filters and sort
  useEffect(() => {
    let filteredProducts = [...mockProducts];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by categories
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        selectedCategories.includes(product.category)
      );
    }
    
    // Filter by price range
    filteredProducts = filteredProducts.filter(product => {
      const price = product.discountedPrice || product.originalPrice;
      return price >= priceRange.min && price <= priceRange.max;
    });
    
    // Filter by stock status
    if (inStockOnly) {
      filteredProducts = filteredProducts.filter(product => product.stock > 0);
    }
    
    // Apply sorting
    switch (selectedSortOption) {
      case 'price-low-high':
        filteredProducts.sort((a, b) => {
          const priceA = a.discountedPrice || a.originalPrice;
          const priceB = b.discountedPrice || b.originalPrice;
          return priceA - priceB;
        });
        break;
      case 'price-high-low':
        filteredProducts.sort((a, b) => {
          const priceA = a.discountedPrice || a.originalPrice;
          const priceB = b.discountedPrice || b.originalPrice;
          return priceB - priceA;
        });
        break;
      case 'popular':
        filteredProducts.sort((a, b) => b.popular - a.popular);
        break;
      case 'newest':
      default:
        // Keep default order (assuming newest first)
        break;
    }
    
    setDisplayedProducts(filteredProducts);
  }, [searchQuery, selectedCategories, selectedSortOption, priceRange, inStockOnly]);
  
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 200000 });
    setInStockOnly(false);
    setSelectedSortOption('newest');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container py-8">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
              <ShoppingBag className="mr-2 h-6 w-6" />
              All Products
            </h1>
            <div className="flex items-center text-gray-500 text-sm">
              <Link to="/" className="hover:text-primary">Home</Link>
              <span className="mx-2">/</span>
              <span>Products</span>
              {selectedCategories.length > 0 && (
                <>
                  <span className="mx-2">/</span>
                  <span>
                    {selectedCategories.map(catId => {
                      const category = mockCategories.find(c => c.id === catId);
                      return category ? category.name : '';
                    }).join(', ')}
                  </span>
                </>
              )}
            </div>
          </div>
          
          <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-1 gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              
              <Button
                variant="outline"
                className="md:hidden"
                onClick={() => setIsFilterOpen(true)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 whitespace-nowrap">Sort by:</span>
              <select
                className="border rounded-md px-2 py-1 text-sm bg-white"
                value={selectedSortOption}
                onChange={(e) => setSelectedSortOption(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
              </select>
            </div>
          </div>
          
          <div className="flex gap-6">
            {/* Desktop Filter Sidebar */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium flex items-center">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </h3>
                  {(selectedCategories.length > 0 || inStockOnly || searchQuery || selectedSortOption !== 'newest') && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="h-8 text-xs"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
                
                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium mb-2">Categories</h4>
                    <div className="space-y-1">
                      {mockCategories.map(category => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => toggleCategory(category.id)}
                          />
                          <label 
                            htmlFor={`category-${category.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-2">Price Range</h4>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        className="w-24 text-sm"
                        placeholder="Min"
                      />
                      <span className="mx-2">-</span>
                      <Input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="w-24 text-sm"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Stock Status */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="in-stock"
                        checked={inStockOnly}
                        onCheckedChange={(checked) => setInStockOnly(!!checked)}
                      />
                      <label 
                        htmlFor="in-stock"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        In Stock Only
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="flex-1">
              {displayedProducts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-12 w-12 mx-auto text-gray-400 mb-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 14a2 2 0 100-4 2 2 0 000 4z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m-9-9a9 9 0 019-9m-9 9a9 9 0 019-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                  <Button onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Showing {displayedProducts.length} products
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {displayedProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Mobile Filter Drawer */}
          <div className={cn(
            "fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity",
            isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}>
            <div className={cn(
              "fixed bottom-0 left-0 right-0 bg-white rounded-t-lg p-4 transition-transform transform",
              isFilterOpen ? "translate-y-0" : "translate-y-full"
            )}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Filters</h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="max-h-[70vh] overflow-y-auto">
                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <h4 className="font-medium mb-2">Categories</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {mockCategories.map(category => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => toggleCategory(category.id)}
                          />
                          <label 
                            htmlFor={`mobile-category-${category.id}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium mb-2">Price Range</h4>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        className="w-full text-sm"
                        placeholder="Min"
                      />
                      <span className="mx-2">-</span>
                      <Input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="w-full text-sm"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Stock Status */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="mobile-in-stock"
                        checked={inStockOnly}
                        onCheckedChange={(checked) => setInStockOnly(!!checked)}
                      />
                      <label 
                        htmlFor="mobile-in-stock"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        In Stock Only
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={clearFilters}
                >
                  Clear All
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
