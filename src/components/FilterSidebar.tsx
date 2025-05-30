
import React from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useCategories } from '@/hooks/useCategories';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: number[];
  onPriceRangeChange: (range: number[]) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

const FilterSidebar = ({
  isOpen,
  onClose,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  onApplyFilters,
  onClearFilters
}: FilterSidebarProps) => {
  const { categories } = useCategories();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filtres
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Catégories */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Catégorie</Label>
              <Select value={selectedCategory} onValueChange={onCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gamme de prix */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Gamme de prix: {priceRange[0]}FC - {priceRange[1]}FC
              </Label>
              <Slider
                value={priceRange}
                onValueChange={onPriceRangeChange}
                max={10000}
                min={0}
                step={100}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>0 FC</span>
                <span>10,000 FC</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-6 border-t">
              <Button 
                onClick={onApplyFilters}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Appliquer les filtres
              </Button>
              <Button 
                onClick={onClearFilters}
                variant="outline"
                className="w-full"
              >
                Effacer les filtres
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
