
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, Plus, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCategories } from '@/hooks/useCategories';
import CategoryDetailDialog from './CategoryDetailDialog';
import VisibilityToggleButton from './VisibilityToggleButton';
import { toast } from '@/hooks/use-toast';

interface CategoriesSectionProps {
  searchTerm: string;
  showHidden?: boolean;
}

const CategoriesSection = ({ searchTerm, showHidden = false }: CategoriesSectionProps) => {
  const navigate = useNavigate();
  const { categories, isLoading, deleteCategory, updateCategory } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const filteredCategories = categories?.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVisibility = showHidden ? !category.is_visible : category.is_visible;
    return matchesSearch && matchesVisibility;
  }) || [];

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await deleteCategory.mutateAsync(id);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };
  
  const handleVisibilityToggle = async (id: string, currentVisibility: boolean) => {
    try {
      await updateCategory.mutateAsync({ 
        id, 
        is_visible: !currentVisibility 
      });
      
      toast({
        title: "Visibilité modifiée",
        description: `La catégorie est maintenant ${!currentVisibility ? 'visible' : 'masquée'}`,
      });
    } catch (error) {
      console.error('Erreur lors du changement de visibilité:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors du changement de visibilité",
        variant: "destructive",
      });
    }
  };

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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            {showHidden ? 'Catégories masquées' : 'Catégories visibles'} ({filteredCategories.length})
          </CardTitle>
          <Button onClick={() => navigate('/admin/catalog/categories/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle catégorie
          </Button>
        </CardHeader>
        <CardContent>
          {filteredCategories.length === 0 ? (
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
                    <TableHead>Visibilité</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
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
                        <VisibilityToggleButton
                          isVisible={category.is_visible}
                          onToggle={() => handleVisibilityToggle(category.id, category.is_visible)}
                        />
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
