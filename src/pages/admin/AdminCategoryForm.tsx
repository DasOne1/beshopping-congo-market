import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCategories } from '@/hooks/useCategories';
import ImageUpload from '@/components/ImageUpload';
import { Category } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';

const AdminCategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const { categories, createCategory, updateCategory } = useCategories();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    parent_id: '',
    is_visible: true
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit && categories && id) {
      const category = categories.find((c: Category) => c.id === id);
      if (category) {
        setFormData({
          name: category.name || '',
          description: category.description || '',
          image: category.image || '',
          parent_id: category.parent_id || '',
          is_visible: category.is_visible ?? true
        });
      }
    }
  }, [isEdit, categories, id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const categoryData = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        parent_id: formData.parent_id === 'none' ? null : formData.parent_id
      };

      if (isEdit && id) {
        await updateCategory.mutateAsync({ id, ...categoryData });
      } else {
        await createCategory.mutateAsync(categoryData);
      }
      navigate('/admin/catalog');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setLoading(false);
    }
  };

  const parentCategories = categories?.filter(cat => !cat.parent_id) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/catalog')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Retour</span>
            </Button>
            <h1 className="text-lg sm:text-xl font-semibold">
              {isEdit ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </h1>
          </div>
          <Button type="submit" disabled={loading} className="flex items-center gap-2">
            {loading && <span className="loader mr-2" />}
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-8">
        <form id="category-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations principales */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations de base</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom de la catégorie *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    value={formData.image}
                    onChange={(value) => setFormData(prev => ({ ...prev, image: value }))}
                    onRemove={() => setFormData(prev => ({ ...prev, image: '' }))}
                    maxSize={2}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="parent">Catégorie parent</Label>
                    <Select
                      value={formData.parent_id}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, parent_id: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Aucune (catégorie principale)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucune (catégorie principale)</SelectItem>
                        {parentCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="visible">Visible</Label>
                    <Checkbox
                      id="visible"
                      checked={formData.is_visible}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_visible: checked as boolean }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCategoryForm;
