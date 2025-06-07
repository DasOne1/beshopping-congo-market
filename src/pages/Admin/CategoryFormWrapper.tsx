/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import CategoryForm from './CategoryForm';
import { toast } from '@/components/ui/use-toast';
import AdminLayout from '@/components/Admin/AdminLayout';

const CategoryFormWrapper = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { categories, createCategory, updateCategory } = useCategories();

  const category = id ? categories.find(c => c.id === id) : null;

  const handleSave = async (data: any) => {
    try {
      if (id) {
        await updateCategory.mutateAsync({ id, ...data });
        toast({
          title: "Succès",
          description: "La catégorie a été modifiée avec succès",
        });
      } else {
        await createCategory.mutateAsync(data);
        toast({
          title: "Succès",
          description: "La catégorie a été créée avec succès",
        });
      }
      navigate('/dasgabriel@adminaccess/categories');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/dasgabriel@adminaccess/categories');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {category ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {category ? 'Modifiez les informations de la catégorie' : 'Créez une nouvelle catégorie'}
            </p>
          </div>
        </div>
        <CategoryForm
          category={category}
          categories={categories}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </AdminLayout>
  );
};

export default CategoryFormWrapper; 