
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Package, Heart, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { motion } from 'framer-motion';

const Account = () => {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { cart } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-20 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <User className="mr-2 h-6 w-6" />
              Mon Compte
            </h1>
          </div>

          {/* Statistiques simplifiées */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link to="/favorites">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center">
                    <Heart className="mr-2 h-6 w-6 text-red-500" />
                    Favoris
                  </CardTitle>
                  <CardDescription>
                    Vos produits préférés
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">
                    {favorites.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {favorites.length === 0 ? 'Aucun favori' : 
                     favorites.length === 1 ? 'produit favori' : 'produits favoris'}
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/cart">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center">
                    <ShoppingCart className="mr-2 h-6 w-6 text-blue-500" />
                    Panier
                  </CardTitle>
                  <CardDescription>
                    Vos articles en attente
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    {cart.length}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {cart.length === 0 ? 'Panier vide' : 
                     cart.length === 1 ? 'article dans le panier' : 'articles dans le panier'}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Message d'encouragement */}
          <div className="text-center mt-12">
            <div className="max-w-md mx-auto">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Découvrez nos produits</h2>
              <p className="text-muted-foreground mb-6">
                Explorez notre catalogue et trouvez les produits qui vous conviennent
              </p>
              <Button asChild size="lg">
                <Link to="/products">Voir nos produits</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </main>

      <div className="pb-16 md:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default Account;
