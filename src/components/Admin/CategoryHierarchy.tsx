
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronRight, Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { useCategories, Category } from '@/hooks/useCategories';
import { useNavigate } from 'react-router-dom';

interface CategoryHierarchyProps {
  categories: Category[];
  onDeleteCategory: (id: string) => void;
  onToggleVisibility: (id: string, isVisible: boolean) => void;
}

const CategoryHierarchy: React.FC<CategoryHierarchyProps> = ({
  categories,
  onDeleteCategory,
  onToggleVisibility
}) => {
  const navigate = useNavigate();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Organiser les catégories en hiérarchie
  const rootCategories = categories.filter(cat => !cat.parent_id);
  const getSubCategories = (parentId: string) => 
    categories.filter(cat => cat.parent_id === parentId);

  const toggleExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const CategoryRow: React.FC<{ 
    category: Category; 
    level: number; 
    hasChildren: boolean;
  }> = ({ category, level, hasChildren }) => {
    const isExpanded = expandedCategories.has(category.id);
    const subCategories = getSubCategories(category.id);

    return (
      <>
        <div 
          className={`flex items-center justify-between p-3 border-b hover:bg-muted/50 transition-colors`}
          style={{ paddingLeft: `${12 + level * 24}px` }}
        >
          <div className="flex items-center gap-3 flex-1">
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpanded(category.id)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="w-6" />
            )}

            {category.image ? (
              <img 
                src={category.image} 
                alt={category.name}
                className="w-8 h-8 object-cover rounded"
              />
            ) : (
              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  {category.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">{category.name}</h3>
                {level > 0 && (
                  <Badge variant="outline" className="text-xs">
                    Sous-catégorie
                  </Badge>
                )}
              </div>
              {category.description && (
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor={`visibility-${category.id}`} className="text-sm">
                {category.is_visible ? 'Visible' : 'Masqué'}
              </Label>
              <Switch
                id={`visibility-${category.id}`}
                checked={category.is_visible}
                onCheckedChange={(checked) => onToggleVisibility(category.id, checked)}
              />
              {category.is_visible ? (
                <Eye className="h-4 w-4 text-green-600" />
              ) : (
                <EyeOff className="h-4 w-4 text-red-600" />
              )}
            </div>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/dasgabriel@adminaccess/categories/new?parent=${category.id}`)}
                title="Ajouter une sous-catégorie"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/dasgabriel@adminaccess/categories/edit/${category.id}`)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteCategory(category.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {isExpanded && subCategories.map(subCat => (
          <CategoryRow
            key={subCat.id}
            category={subCat}
            level={level + 1}
            hasChildren={getSubCategories(subCat.id).length > 0}
          />
        ))}
      </>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hiérarchie des catégories</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {rootCategories.length > 0 ? (
          <div className="divide-y">
            {rootCategories.map(category => (
              <CategoryRow
                key={category.id}
                category={category}
                level={0}
                hasChildren={getSubCategories(category.id).length > 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucune catégorie trouvée</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryHierarchy;
