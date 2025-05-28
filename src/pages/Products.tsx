
import React, { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { motion } from 'framer-motion';

const Products = () => {
  const { products, isLoading } = useProducts();
  const { categories } = useCategories();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryFromUrl ? [categoryFromUrl] : []
  );
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategories.length > 0 && product.category_id && 
          !selectedCategories.includes(product.category_id)) {
        return false;
      }

      // Price filter
      const price = product.discounted_price || product.original_price;
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }

      // Stock filter
      if (showOnlyInStock && product.stock <= 0) {
        return false;
      }

      // Featured filter
      if (showOnlyFeatured && !product.featured) {
        return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.discounted_price || a.original_price) - (b.discounted_price || b.original_price);
        case 'price-high':
          return (b.discounted_price || b.original_price) - (a.discounted_price || a.original_price);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popular':
          return (b.popular || 0) - (a.popular || 0);
        case 'newest':
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        default: // featured
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });

    return filtered;
  }, [products, searchQuery, sortBy, selectedCategories, priceRange, showOnlyInStock, showOnlyFeatured]);

  const handleCategoryChange = (categoryId: string, checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    }
  };

  const handleInStockChange = (checked: boolean | 'indeterminate') => {
    setShowOnlyInStock(checked === true);
  };

  const handleFeaturedChange = (checked: boolean | 'indeterminate') => {
    setShowOnlyFeatured(checked === true);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange([0, 1000000]);
    setShowOnlyInStock(false);
    setShowOnlyFeatured(false);
    setSortBy('featured');
  };

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Chargement des produits...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Nos Produits</h1>
          
          {/* Search and Controls */}
          <div className="mb-6 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher des produits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-border"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] bg-background border-border">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">En vedette</SelectItem>
                    <SelectItem value="newest">Plus récent</SelectItem>
                    <SelectItem value="popular">Populaire</SelectItem>
                    <SelectItem value="price-low">Prix: croissant</SelectItem>
                    <SelectItem value="price-high">Prix: décroissant</SelectItem>
                    <SelectItem value="name">Nom A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="border-border">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="bg-background border-border">
                    <SheetHeader>
                      <SheetTitle className="text-foreground">Filtres</SheetTitle>
                      <SheetDescription className="text-muted-foreground">
                        Affinez votre recherche avec ces filtres
                      </SheetDescription>
                    </SheetHeader>
                    
                    <div className="mt-6 space-y-6">
                      {/* Categories */}
                      <div>
                        <h3 className="font-medium mb-3 text-foreground">Catégories</h3>
                        <div className="space-y-2">
                          {categories.map(category => (
                            <div key={category.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={category.id}
                                checked={selectedCategories.includes(category.id)}
                                onCheckedChange={(checked) => 
                                  handleCategoryChange(category.id, checked)
                                }
                              />
                              <label htmlFor={category.id} className="text-sm text-foreground">
                                {category.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Price Range */}
                      <div>
                        <h3 className="font-medium mb-3 text-foreground">Gamme de prix</h3>
                        <div className="px-2">
                          <Slider
                            value={priceRange}
                            onValueChange={setPriceRange}
                            max={1000000}
                            min={0}
                            step={10000}
                            className="w-full"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground mt-2">
                            <span>{formatPrice(priceRange[0])} FC</span>
                            <span>{formatPrice(priceRange[1])} FC</span>
                          </div>
                        </div>
                      </div>

                      {/* Additional Filters */}
                      <div>
                        <h3 className="font-medium mb-3 text-foreground">Options</h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="inStock"
                              checked={showOnlyInStock}
                              onCheckedChange={handleInStockChange}
                            />
                            <label htmlFor="inStock" className="text-sm text-foreground">
                              En stock seulement
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="featured"
                              checked={showOnlyFeatured}
                              onCheckedChange={handleFeaturedChange}
                            />
                            <label htmlFor="featured" className="text-sm text-foreground">
                              Produits vedettes
                            </label>
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={clearFilters} 
                        variant="outline" 
                        className="w-full border-border"
                      >
                        Effacer les filtres
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="border-border"
                >
                  {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-4 text-sm text-muted-foreground">
            {filteredAndSortedProducts.length} produit(s) trouvé(s)
          </div>

          {/* Products Grid */}
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun produit trouvé avec ces critères.</p>
            </div>
          ) : (
            <motion.div
              className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {filteredAndSortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;
