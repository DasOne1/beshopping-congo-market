import React, { useState } from 'react';
import { Plus, Edit, Trash2, Upload, Save, X, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProducts, Product } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

const Products = () => {
  const { products, isLoading, createProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useCategories();
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    original_price: 0,
    discounted_price: 0,
    stock: 0,
    category_id: '',
    images: [],
    tags: [],
    featured: false,
    status: 'active'
  });
  const [newImage, setNewImage] = useState('');
  const [newTag, setNewTag] = useState('');

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleInputChange = (field: string, value: any) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [field]: value });
    } else {
      setNewProduct({ ...newProduct, [field]: value });
    }
  };

  const handleAddImage = () => {
    if (!newImage.trim()) return;
    
    const currentImages = editingProduct?.images || newProduct.images || [];
    const updatedImages = [...currentImages, newImage.trim()];
    
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, images: updatedImages });
    } else {
      setNewProduct({ ...newProduct, images: updatedImages });
    }
    setNewImage('');
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = editingProduct?.images || newProduct.images || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, images: updatedImages });
    } else {
      setNewProduct({ ...newProduct, images: updatedImages });
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    
    const currentTags = editingProduct?.tags || newProduct.tags || [];
    const updatedTags = [...currentTags, newTag.trim()];
    
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, tags: updatedTags });
    } else {
      setNewProduct({ ...newProduct, tags: updatedTags });
    }
    setNewTag('');
  };

  const handleRemoveTag = (index: number) => {
    const currentTags = editingProduct?.tags || newProduct.tags || [];
    const updatedTags = currentTags.filter((_, i) => i !== index);
    
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, tags: updatedTags });
    } else {
      setNewProduct({ ...newProduct, tags: updatedTags });
    }
  };

  const handleCreateProduct = () => {
    if (!newProduct.name || !newProduct.description || !newProduct.original_price) {
      return;
    }

    createProduct.mutate({
      name: newProduct.name,
      description: newProduct.description,
      original_price: newProduct.original_price,
      discounted_price: newProduct.discounted_price || undefined,
      stock: newProduct.stock || 0,
      category_id: newProduct.category_id || undefined,
      images: newProduct.images || [],
      tags: newProduct.tags || [],
      featured: newProduct.featured || false,
      status: newProduct.status || 'active'
    } as any);

    setIsAdding(false);
    setNewProduct({
      name: '',
      description: '',
      original_price: 0,
      discounted_price: 0,
      stock: 0,
      category_id: '',
      images: [],
      tags: [],
      featured: false,
      status: 'active'
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct || !editingProduct.id) return;

    updateProduct.mutate(editingProduct);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct.mutate(id);
    }
  };

  const ProductForm = ({ product, isEditing }: { product: Partial<Product>, isEditing: boolean }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Nom du produit *</Label>
          <Input
            id="name"
            value={product.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Nom du produit"
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={product.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Description du produit"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="original_price">Prix original (FC) *</Label>
            <Input
              id="original_price"
              type="number"
              value={product.original_price || 0}
              onChange={(e) => handleInputChange('original_price', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="discounted_price">Prix promotionnel (FC)</Label>
            <Input
              id="discounted_price"
              type="number"
              value={product.discounted_price || 0}
              onChange={(e) => handleInputChange('discounted_price', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              value={product.stock || 0}
              onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select value={product.category_id || ''} onValueChange={(value) => handleInputChange('category_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucune catégorie</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={product.featured || false}
            onCheckedChange={(checked) => handleInputChange('featured', checked)}
          />
          <Label htmlFor="featured">Produit vedette</Label>
        </div>

        <div>
          <Label htmlFor="status">Statut</Label>
          <Select value={product.status || 'active'} onValueChange={(value) => handleInputChange('status', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Actif</SelectItem>
              <SelectItem value="inactive">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Images du produit</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              placeholder="URL de l'image"
            />
            <Button onClick={handleAddImage} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(product.images || []).map((image, index) => (
              <div key={index} className="relative group">
                <img src={image} alt={`Image ${index + 1}`} className="w-full h-20 object-cover rounded border" />
                <Button
                  onClick={() => handleRemoveImage(index)}
                  size="sm"
                  variant="destructive"
                  className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Tags</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Ajouter un tag"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            />
            <Button onClick={handleAddTag} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(product.tags || []).map((tag, index) => (
              <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded text-sm">
                {tag}
                <Button
                  onClick={() => handleRemoveTag(index)}
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Package className="mr-3 h-6 w-6 text-blue-600" />
            Gestion des Produits
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez votre catalogue de produits
          </p>
        </div>
        <Button 
          onClick={() => setIsAdding(true)} 
          disabled={isAdding}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un produit
        </Button>
      </div>

      {isAdding && (
        <Card className="shadow-sm">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
            <CardTitle className="text-lg">Ajouter un nouveau produit</CardTitle>
            <CardDescription>Remplissez le formulaire pour ajouter un produit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <ProductForm product={newProduct} isEditing={false} />
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleCreateProduct}
                disabled={createProduct.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {createProduct.isPending ? 'Création...' : 'Créer le produit'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {editingProduct && (
        <Card className="shadow-sm border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-900/30">
            <CardTitle className="text-lg text-blue-900 dark:text-blue-100">Modifier le produit</CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">Modifiez les informations du produit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <ProductForm product={editingProduct} isEditing={true} />
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setEditingProduct(null)}>
                Annuler
              </Button>
              <Button 
                onClick={handleUpdateProduct}
                disabled={updateProduct.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                {updateProduct.isPending ? 'Mise à jour...' : 'Mettre à jour'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-sm">
        <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
          <CardTitle className="text-lg">Liste des Produits ({products.length})</CardTitle>
          <CardDescription>Gérez tous vos produits depuis cette interface</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell>
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-16 h-12 object-cover rounded" 
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Upload className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{product.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {product.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {formatPrice(product.discounted_price || product.original_price)} FC
                        </div>
                        {product.discounted_price && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            {formatPrice(product.original_price)} FC
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock === 0 
                          ? 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-500' 
                          : product.stock <= 5 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-500'
                          : 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-500'
                      }`}>
                        {product.stock === 0 ? 'Rupture' : `${product.stock} unités`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-500' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-500'
                      }`}>
                        {product.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingProduct(product)}
                          disabled={editingProduct?.id === product.id}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={deleteProduct.isPending}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {products.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Package className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <p className="text-lg font-medium mb-2">Aucun produit trouvé</p>
                <p className="text-sm mb-4">Commencez par créer votre premier produit</p>
                <Button onClick={() => setIsAdding(true)} variant="outline">
                  Créer un produit
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Products;
