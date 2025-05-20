
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/contexts/FavoritesContext';
import { mockProducts } from '@/data/mockData';

const Favorites = () => {
  const { favorites, removeFromFavorites } = useFavorites();
  
  // Get detailed product information for favorited items
  const favoriteProducts = mockProducts.filter(product => 
    favorites.includes(product.id)
  );
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
            <Heart className="mr-2 h-6 w-6" />
            Your Favorites
          </h1>
          
          {favoriteProducts.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
              <p className="text-gray-500 mb-6">
                You haven't added any products to your favorites list yet.
              </p>
              <Button asChild>
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-between">
                <span>{favoriteProducts.length} item(s) in your favorites</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                  onClick={() => {
                    // Remove all favorites one by one
                    favorites.forEach(id => removeFromFavorites(id));
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {favoriteProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Favorites;
