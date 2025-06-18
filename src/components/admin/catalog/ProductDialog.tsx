/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Product } from '@/types';
import ProductBasicInfoForm from './ProductBasicInfoForm';
import ProductPricingForm from './ProductPricingForm';
import ProductCategoriesForm from './ProductCategoriesForm';
import ProductDetailsForm from './ProductDetailsForm';
import ProductImagesForm from './ProductImagesForm';
import ProductTagsForm from './ProductTagsForm';
import ProductStatusForm from './ProductStatusForm';

interface ProductDialogProps {
  product?: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProductDialog = ({ product, open, onOpenChange }: ProductDialogProps) => {
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { createProduct, updateProduct } = useProducts({
    includeHidden: true,
    includeInactive: true
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    original_price: '',
    discount: '',
    stock: '',
    category_id: '',
    subcategory_id: '',
    sku: '',
    weight: '',
    status: 'active' as 'active' | 'inactive' | 'draft',
    is_visible: true,
    featured: false,
    images: [''],
    tags: [''],
    colors: [] as string[],
    sizes: [] as string[],
    gender: '' as 'homme' | 'femme' | 'mixte' | '',
    material: '',
    brand: '',
    collection: '',
    season: '',
    care_instructions: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        original_price: product.original_price?.toString() || '',
        discount: product.discount?.toString() || '',
        stock: product.stock?.toString() || '',
        category_id: product.category_id || '',
        subcategory_id: product.subcategory_id || '',
        sku: product.sku || '',
        weight: product.weight?.toString() || '',
        status: product.status || 'active',
        is_visible: product.is_visible ?? true,
        featured: product.featured ?? false,
        images: product.images?.length ? product.images : [''],
        tags: product.tags?.length ? product.tags : [''],
        colors: product.colors || [],
        sizes: product.sizes || [],
        gender: product.gender || '',
        material: product.material || '',
        brand: product.brand || '',
        collection: product.collection || '',
        season: product.season || '',
        care_instructions: product.care_instructions || '',
      });
      setSelectedCategoryId(product.category_id || '');
    } else {
      setFormData({
        name: '',
        description: '',
        original_price: '',
        discount: '',
        stock: '',
        category_id: '',
        subcategory_id: '',
        sku: '',
        weight: '',
        status: 'active',
        is_visible: true,
        featured: false,
        images: [''],
        tags: [''],
        colors: [],
        sizes: [],
        gender: '',
        material: '',
        brand: '',
        collection: '',
        season: '',
        care_instructions: '',
      });
      setSelectedCategoryId('');
    }
  }, [product]);

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({ ...prev, category_id: categoryId, subcategory_id: '' }));
    setSelectedCategoryId(categoryId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const price = parseFloat(formData.original_price) || 0;
      const discount = parseFloat(formData.discount) || 0;
      const discounted_price = discount > 0 ? price * (1 - discount / 100) : null;
      
      const productData = {
        ...formData,
        original_price: price,
        discount: discount,
        discounted_price,
        stock: parseInt(formData.stock) || 0,
        weight: parseFloat(formData.weight) || null,
        images: formData.images.filter(img => img.trim() !== ''),
        tags: formData.tags.filter(tag => tag.trim() !== ''),
        category_id: formData.category_id || null,
        subcategory_id: formData.subcategory_id || null,
        gender: formData.gender || null,
      };

      if (product) {
        await updateProduct.mutateAsync({ id: product.id, ...productData });
      } else {
        await createProduct.mutateAsync(productData);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Modifier le produit' : 'Nouveau produit'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <ProductBasicInfoForm
            formData={{
              name: formData.name,
              description: formData.description,
              sku: formData.sku,
              weight: formData.weight,
            }}
            onChange={handleFieldChange}
          />

          {/* Prix et Stock */}
          <ProductPricingForm
            formData={{
              original_price: formData.original_price,
              discount: formData.discount,
              stock: formData.stock,
            }}
            onChange={handleFieldChange}
          />

          {/* Catégories */}
          <ProductCategoriesForm
            formData={{
              category_id: formData.category_id,
              subcategory_id: formData.subcategory_id,
            }}
            onChange={handleFieldChange}
            onCategoryChange={handleCategoryChange}
          />

          {/* Détails du produit */}
          <ProductDetailsForm
            formData={{
              gender: formData.gender,
              brand: formData.brand,
              material: formData.material,
              collection: formData.collection,
              season: formData.season,
              care_instructions: formData.care_instructions,
              colors: formData.colors,
              sizes: formData.sizes,
            }}
            onChange={handleFieldChange}
          />

          {/* Images */}
          <ProductImagesForm
            images={formData.images}
            onChange={(images) => handleFieldChange('images', images)}
          />

          {/* Tags */}
          <ProductTagsForm
            tags={formData.tags}
            onChange={(tags) => handleFieldChange('tags', tags)}
          />

          {/* Statut et visibilité */}
          <ProductStatusForm
            formData={{
              status: formData.status,
              is_visible: formData.is_visible,
              featured: formData.featured,
            }}
            onChange={handleFieldChange}
          />
          
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {product ? 'Modification...' : 'Création...'}
                </div>
              ) : (
                product ? 'Modifier' : 'Créer'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
