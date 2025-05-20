
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { mockProducts, mockCategories } from '@/data/mockData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('popular');
  const [priceRange, setPriceRange] = useState([0, 500000]); // In CDF
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  // Price range for the filter
  const maxPrice = 500000; // CDF
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...mockProducts];
    
    // Filter by search query
    if (searchQuery) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      result = result.filter(product => 
        product.category === selectedCategory
      );
    }
    
    // Filter by price range
    result = result.filter(product => 
      product.originalPrice >= priceRange[0] && product.originalPrice <= priceRange[1]
    );
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => a.originalPrice - b.originalPrice);
        break;
      case 'price-high':
        result.sort((a, b) => b.originalPrice - a.originalPrice);
        break;
      case 'newest':
        // Since createdAt isn't in our Product type, we'll sort by ID as a fallback
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default: // 'popular'
        result.sort((a, b) => b.popular - a.popular);
        break;
    }
    
    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, sortOption, priceRange]);
  
  // Update active filters for display
  useEffect(() => {
    const filters = [];
    
    if (selectedCategory) {
      const category = mockCategories.find(c => c.id === selectedCategory);
      if (category) {
        filters.push(`Category: ${category.name}`);
      }
    }
    
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) {
      filters.push(`Price: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()} CDF`);
    }
    
    setActiveFilters(filters);
  }, [selectedCategory, priceRange]);
  
  const clearAllFilters = () => {
    setSelectedCategory(null);
    setPriceRange([0, maxPrice]);
  };
  
  const removeFilter = (filter: string) => {
    if (filter.startsWith('Category:')) {
      setSelectedCategory(null);
    } else if (filter.startsWith('Price:')) {
      setPriceRange([0, maxPrice]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-8 bg-accent/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Product Categories</h1>
              <p className="text-muted-foreground">
                Browse our wide selection of products by category
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Categories Navigation */}
        <section className="py-4 border-b border-border/40">
          <div className="container">
            <div className="overflow-x-auto pb-2">
              <motion.div 
                className="flex whitespace-nowrap gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button 
                  variant={selectedCategory === null ? "default" : "outline"} 
                  className="rounded-full"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Categories
                </Button>
                
                {mockCategories.map((category) => (
                  <Button 
                    key={category.id} 
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className="rounded-full"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Search and Filters */}
        <section className="py-4 bg-background sticky top-16 z-10 border-b border-border/40">
          <div className="container">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
                    onClick={() => setSearchQuery('')}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear search</span>
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2 items-center">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
                
                <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>Filter Products</SheetTitle>
                    </SheetHeader>
                    
                    <div className="py-6 space-y-6">
                      <Accordion type="single" collapsible className="w-full" defaultValue="category">
                        <AccordionItem value="category">
                          <AccordionTrigger>Categories</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 pt-1">
                              {mockCategories.map((category) => (
                                <div key={category.id} className="flex items-center">
                                  <Checkbox 
                                    id={`category-${category.id}`} 
                                    checked={selectedCategory === category.id}
                                    onCheckedChange={(checked) => {
                                      setSelectedCategory(checked ? category.id : null);
                                    }}
                                  />
                                  <label
                                    htmlFor={`category-${category.id}`}
                                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    {category.name}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="price">
                          <AccordionTrigger>Price Range</AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-1">
                              <Slider
                                defaultValue={[0, maxPrice]}
                                min={0}
                                max={maxPrice}
                                step={10000}
                                value={priceRange}
                                onValueChange={setPriceRange}
                              />
                              <div className="flex items-center justify-between">
                                <div className="border border-input rounded-md p-2 w-24 text-center">
                                  {priceRange[0].toLocaleString()}
                                </div>
                                <span className="text-muted-foreground">to</span>
                                <div className="border border-input rounded-md p-2 w-24 text-center">
                                  {priceRange[1].toLocaleString()}
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground text-center">
                                Price in Congolese Francs (CDF)
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                    
                    <div className="flex gap-4 mt-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          clearAllFilters();
                          setIsFiltersOpen(false);
                        }}
                      >
                        Reset Filters
                      </Button>
                      <Button 
                        className="w-full"
                        onClick={() => setIsFiltersOpen(false)}
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {activeFilters.map((filter) => (
                  <Badge
                    key={filter}
                    variant="secondary"
                    className="pl-2 pr-1 py-1 flex items-center gap-1"
                  >
                    {filter}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-transparent"
                      onClick={() => removeFilter(filter)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {filter} filter</span>
                    </Button>
                  </Badge>
                ))}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs hover:bg-transparent hover:underline p-0 h-auto"
                  onClick={clearAllFilters}
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </section>
        
        {/* Products Grid */}
        <section className="py-8">
          <div className="container">
            {selectedCategory && (
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">
                  {mockCategories.find(c => c.id === selectedCategory)?.name || 'Category'}
                </h2>
                <p className="text-muted-foreground">
                  {mockCategories.find(c => c.id === selectedCategory)?.description || 'Browse products in this category.'}
                </p>
              </div>
            )}
            
            <AnimatePresence mode="wait">
              {filteredProducts.length > 0 ? (
                <motion.div
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                >
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="no-products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center py-16"
                >
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    We couldn't find any products matching your criteria.
                    Try adjusting your filters or search term.
                  </p>
                  <Button onClick={clearAllFilters}>
                    Clear all filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
        
        {/* Featured Categories */}
        <section className="py-8 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl font-semibold mb-6">Featured Categories</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {mockCategories.slice(0, 4).map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                    <div className="aspect-[3/2] bg-muted rounded-t-lg flex items-center justify-center">
                      <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">{category.name.charAt(0)}</span>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Browse All Categories */}
        <section className="py-8">
          <div className="container">
            <h2 className="text-2xl font-semibold mb-6">Browse All Categories</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {mockCategories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/40 transition-colors">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-base font-medium text-primary">{category.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {mockProducts.filter(p => p.category === category.id).length} products
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
