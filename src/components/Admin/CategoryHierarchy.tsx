
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Eye, EyeOff, FolderOpen, Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
  parent_id?: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

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

  // Organiser les catégories en hiérarchie
  const organizeCategories = (categories: Category[]) => {
    const categoryMap = new Map();
    const rootCategories: Category[] = [];

    // Créer une map de toutes les catégories
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] });
    });

    // Organiser en hiérarchie
    categories.forEach(category => {
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id);
        if (parent) {
          parent.children.push(categoryMap.get(category.id));
        }
      } else {
        rootCategories.push(categoryMap.get(category.id));
      }
    });

    return rootCategories;
  };

  const renderCategory = (category: any, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const paddingLeft = level * 20;

    return (
      <div key={category.id} className="mb-2">
        <Card className={`border ${!category.is_visible ? 'opacity-60 border-dashed' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between" style={{ paddingLeft: `${paddingLeft}px` }}>
              <div className="flex items-center space-x-3 flex-1">
                {hasChildren ? (
                  <FolderOpen className="h-5 w-5 text-blue-600" />
                ) : (
                  <Folder className="h-5 w-5 text-gray-500" />
                )}
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium">{category.name}</h3>
                    <Badge variant={category.is_visible ? "default" : "secondary"}>
                      {category.is_visible ? "Visible" : "Masqué"}
                    </Badge>
                    {hasChildren && (
                      <Badge variant="outline">
                        {category.children.length} sous-catégorie{category.children.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                  {category.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleVisibility(category.id, !category.is_visible)}
                >
                  {category.is_visible ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/dasgabriel@adminaccess/categories/edit/${category.id}`)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Afficher les sous-catégories */}
        {hasChildren && (
          <div className="ml-4 mt-2">
            {category.children.map((child: any) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const organizedCategories = organizeCategories(categories);

  if (categories.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
          <p className="text-lg font-medium mb-2">Aucune catégorie trouvée</p>
          <p className="text-sm text-muted-foreground mb-4">
            Commencez par créer votre première catégorie
          </p>
          <Button 
            onClick={() => navigate('/dasgabriel@adminaccess/categories/new')} 
            variant="outline"
          >
            Créer une catégorie
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Hiérarchie des catégories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {organizedCategories.map(category => renderCategory(category))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryHierarchy;
