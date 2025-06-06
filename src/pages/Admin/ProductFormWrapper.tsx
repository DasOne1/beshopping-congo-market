/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import ProductForm from './ProductForm';
import { toast } from '@/components/ui/use-toast';
import AdminLayout from '@/components/Admin/AdminLayout';

const ProductFormWrapper = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { products, isLoading: productsLoading, createProduct, updateProduct } = useProducts();

  const product = id ? products.find(p => p.id === id) : null;

  // Afficher un état de chargement
  if (categoriesLoading || productsLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Si on est en mode édition et que le produit n'existe pas
  if (id && !product) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Produit non trouvé</h2>
            <p className="text-gray-600 mb-4">Le produit que vous recherchez n'existe pas ou a été supprimé.</p>
            <button
              onClick={() => navigate('/dasgabriel@adminaccess/products')}
              className="text-primary hover:underline"
            >
              Retour à la liste des produits
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const handleSave = async (data: any) => {
    try {
      if (id) {
        await updateProduct.mutateAsync({ id, ...data });
        toast({
          title: "Succès",
          description: "Le produit a été modifié avec succès",
        });
      } else {
        await createProduct.mutateAsync(data);
        toast({
          title: "Succès",
          description: "Le produit a été créé avec succès",
        });
      }
      navigate('/dasgabriel@adminaccess/products');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/dasgabriel@adminaccess/products');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {product ? 'Modifier le produit' : 'Nouveau produit'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {product ? 'Modifiez les informations du produit' : 'Créez un nouveau produit'}
            </p>
          </div>
        </div>
        <ProductForm
          product={product}
          categories={categories}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </AdminLayout>
  );
};

export default ProductFormWrapper; 