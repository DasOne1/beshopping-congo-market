
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Category } from '@/types';

interface ProductFiltersProps {
  isOpen?: boolean;
  onClose?: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  priceRange: number[];
  setPriceRange: (range: number[]) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: Category[];
  isLoading?: boolean;
  onClearFilters: () => void;
  sortBy?: string;
  setSortBy?: (sort: string) => void;
  hasActiveFilters?: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  isOpen,
  onClose,
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  selectedCategory,
  setSelectedCategory,
  categories,
  isLoading = false,
  onClearFilters,
  sortBy = 'name',
  setSortBy,
  hasActiveFilters = false
}) => {
  // Si c'est utilisé dans un Sheet, on utilise les props isOpen et onClose
  if (isOpen !== undefined && onClose) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="left" className="w-72 sm:w-80">
          <SheetHeader>
            <SheetTitle>Filtres</SheetTitle>
            <SheetClose />
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            <FilterContent 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              isLoading={isLoading}
              onClearFilters={onClearFilters}
              sortBy={sortBy}
              setSortBy={setSortBy}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Sinon, on affiche directement le contenu (pour desktop)
  return (
    <div className="bg-card border rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Filtres</h2>
      <FilterContent 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        isLoading={isLoading}
        onClearFilters={onClearFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        hasActiveFilters={hasActiveFilters}
      />
    </div>
  );
};

// Composant pour le contenu des filtres
const FilterContent: React.FC<Omit<ProductFiltersProps, 'isOpen' | 'onClose'>> = ({
  searchTerm,
  setSearchTerm,
  priceRange,
  setPriceRange,
  selectedCategory,
  setSelectedCategory,
  categories,
  isLoading = false,
  onClearFilters,
  sortBy = 'name',
  setSortBy,
  hasActiveFilters = false
}) => {
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Rechercher</Label>
        <Input
          id="search"
          placeholder="Rechercher des produits..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <Label>Catégories</Label>
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.parent_id ? 
                    `${categories.find(c => c.id === category.parent_id)?.name} > ${category.name}` : 
                    category.name
                  }
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Sort */}
      {setSortBy && (
        <div className="space-y-2">
          <Label>Trier par</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom</SelectItem>
              <SelectItem value="price-asc">Prix croissant</SelectItem>
              <SelectItem value="price-desc">Prix décroissant</SelectItem>
              <SelectItem value="newest">Plus récent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-2">
        <Label>Gamme de prix (FC)</Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000000}
            step={10000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{priceRange[0].toLocaleString()} FC</span>
            <span>{priceRange[1].toLocaleString()} FC</span>
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button variant="outline" onClick={onClearFilters} className="w-full">
          <X className="w-4 h-4 mr-2" />
          Effacer les filtres
        </Button>
      )}
    </div>
  );
};

export default ProductFilters;
