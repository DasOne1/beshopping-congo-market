import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Package, Edit, Trash2, Eye, EyeOff, Star, Plus } from 'lucide-react';
import AdminLayout from "@/layouts/AdminLayout";
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Product, Category } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import ProductForm from './ProductForm';

const Products = () => {
  const { products, isLoading, createProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowDialog(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowDialog(true);
  };

  const handleSave = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          ...productData
        });
      } else {
        await createProduct.mutateAsync(productData);
      }
      setShowDialog(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct.mutateAsync(id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const handleToggleVisibility = async (product: Product) => {
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        is_visible: !product.is_visible
      });
    } catch (error) {
      console.error('Erreur lors du changement de visibilité:', error);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      await updateProduct.mutateAsync({
        id: product.id,
        featured: !product.featured
      });
    } catch (error) {
      console.error('Erreur lors du changement de mise en avant:', error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Produits</h1>
            <p className="text-muted-foreground">Gérez vos produits et leurs détails</p>
          </div>
          <div className="text-center py-8">Chargement...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Produits</h1>
            <p className="text-muted-foreground">Gérez vos produits et leurs détails</p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Produit
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      {categories.find(cat => cat.id === product.category_id)?.name || 'Sans catégorie'}
                    </TableCell>
                    <TableCell>
                      {product.discounted_price ? (
                        <div>
                          <span className="line-through text-gray-500">
                            {product.original_price.toLocaleString()} FCFA
                          </span>
                          <br />
                          <span className="font-semibold text-green-600">
                            {product.discounted_price.toLocaleString()} FCFA
                          </span>
                        </div>
                      ) : (
                        <span>{product.original_price.toLocaleString()} FCFA</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.stock > 0 ? "secondary" : "destructive"}>
                        {product.stock} unités
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={product.is_visible ? "secondary" : "outline"}>
                          {product.is_visible ? "Visible" : "Masqué"}
                        </Badge>
                        {product.featured && (
                          <Badge variant="default">Mis en avant</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleVisibility(product)}
                        >
                          {product.is_visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFeatured(product)}
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              categories={categories}
              onSave={handleSave}
              onCancel={() => setShowDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Products;
