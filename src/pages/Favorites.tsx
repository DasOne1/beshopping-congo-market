
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useProducts } from '@/hooks/useProducts';

const Favorites = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  const { products, isLoading } = useProducts();
  
  // Get detailed product information for favorited items
  const favoriteProducts = products.filter(product => 
    favorites.includes(product.id)
  );

  if (isLoading) {
    return (
      <>
        <Header />
        
        <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center text-foreground">
            <Heart className="mr-2 h-6 w-6" />
            Vos Favoris
          </h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <ProductSkeleton count={8} />
          </div>
        </main>
        
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center text-foreground">
          <Heart className="mr-2 h-6 w-6" />
          Vos Favoris
        </h1>
        
        {favoriteProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2 text-foreground">Aucun favori pour le moment</h2>
            <p className="text-muted-foreground mb-6">
              Vous n'avez pas encore ajouté de produits à votre liste de favoris.
            </p>
            <Button asChild>
              <Link to="/products">Parcourir les produits</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between">
              <span className="text-foreground">{favoriteProducts.length} article(s) dans vos favoris</span>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                onClick={() => {
                  // Remove all favorites one by one
                  favorites.forEach(id => removeFromFavorites(id));
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Tout effacer
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoriteProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </>
  );
};

export default Favorites;
