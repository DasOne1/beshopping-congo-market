
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, Plus, FolderOpen, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCachedCategories } from '@/hooks/useCachedCategories';
import { useCategories } from '@/hooks/useCategories';
import CategoryDetailDialog from './CategoryDetailDialog';

interface CategoriesSectionProps {
  searchTerm: string;
}

const CategoriesSection = ({ searchTerm }: CategoriesSectionProps) => {
  const navigate = useNavigate();
  const { categories, isLoading } = useCategories(); // Utiliser useCategories pour avoir toutes les catégories
  const { deleteCategory, updateCategory } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const filteredCategories = categories?.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const visibleCategories = filteredCategories.filter(category => category.is_visible);
  const hiddenCategories = filteredCategories.filter(category => !category.is_visible);

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      await deleteCategory.mutateAsync(id);
    }
  };
  
  const handleVisibilityToggle = async (id: string, is_visible: boolean) => {
    await updateCategory.mutateAsync({ id, is_visible: !is_visible });
  };

  const CategoryTable = ({ categories, title }: { categories: any[], title: string }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          {title} ({categories.length})
        </CardTitle>
        <Button onClick={() => navigate('/admin/catalog/categories/new')}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle catégorie
        </Button>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucune catégorie trouvée
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Enfants</TableHead>
                  <TableHead>Visible</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {category.image && (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground">
                            /{category.slug}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {category.parent ? (
                        <Badge variant="outline">{category.parent.name}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {category.children && category.children.length > 0 ? (
                        <Badge variant="secondary">
                          {category.children.length} enfant(s)
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={category.is_visible}
                          onCheckedChange={() => handleVisibilityToggle(category.id, category.is_visible)}
                        />
                        {category.is_visible ? (
                          <Eye className="h-4 w-4 text-green-500" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowDetailDialog(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/catalog/categories/${category.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Catégories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Chargement des catégories...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Tabs defaultValue="visible" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="visible">Catégories visibles</TabsTrigger>
          <TabsTrigger value="hidden">Catégories masquées</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visible">
          <CategoryTable categories={visibleCategories} title="Catégories visibles" />
        </TabsContent>
        
        <TabsContent value="hidden">
          <CategoryTable categories={hiddenCategories} title="Catégories masquées" />
        </TabsContent>
      </Tabs>

      {selectedCategory && (
        <CategoryDetailDialog
          category={selectedCategory}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
        />
      )}
    </>
  );
};

export default CategoriesSection;
