
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Package, Heart, ShoppingCart, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';
import ProductSkeleton from '@/components/ProductSkeleton';
import { motion } from 'framer-motion';

const Account = () => {
  const { favorites } = useFavorites();
  const { cart } = useCart();
  const { products, isLoading } = useProducts();

  // Get favorite products
  const favoriteProducts = products.filter(product => 
    favorites.includes(product.id)
  );

  // Get cart products
  const cartProducts = cart.map(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);
    return {
      ...cartItem,
      product
    };
  }).filter(item => item.product);

  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "Utilisateur",
    email: "utilisateur@example.com",
    phone: "+243 XXX XXX XXX",
    address: "Lubumbashi, Congo"
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-20 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center">
            <User className="mr-2 h-6 w-6" />
            Mon Compte
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* User Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profil Utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{user.address}</span>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Modifier le profil
                </Button>
              </CardContent>
            </Card>

            {/* Favorites Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Mes Favoris
                </CardTitle>
                <CardDescription>
                  {favorites.length} produit(s) dans vos favoris
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-2">
                  {favorites.length}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Produits sauvegardés pour plus tard
                </p>
                <Link to="/favorites">
                  <Button variant="outline" className="w-full">
                    Voir mes favoris
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Cart Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Mon Panier
                </CardTitle>
                <CardDescription>
                  {cart.length} article(s) dans votre panier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-2">
                  {cart.length}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Articles prêts pour la commande
                </p>
                <Link to="/cart">
                  <Button variant="outline" className="w-full">
                    Voir mon panier
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Favorites */}
            <Card>
              <CardHeader>
                <CardTitle>Favoris Récents</CardTitle>
                <CardDescription>Vos derniers produits ajoutés aux favoris</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <ProductSkeleton count={3} />
                  </div>
                ) : favoriteProducts.length > 0 ? (
                  <div className="space-y-4">
                    {favoriteProducts.slice(0, 3).map(product => (
                      <div key={product.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <img 
                          src={product.images[0] || '/favicon.svg'} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <p className="text-sm text-primary font-medium">
                            {(product.discounted_price || product.original_price).toLocaleString()} FC
                          </p>
                        </div>
                      </div>
                    ))}
                    {favoriteProducts.length > 3 && (
                      <Link to="/favorites">
                        <Button variant="ghost" className="w-full">
                          Voir tous les favoris ({favoriteProducts.length})
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Aucun favori pour le moment</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Cart Items */}
            <Card>
              <CardHeader>
                <CardTitle>Articles du Panier</CardTitle>
                <CardDescription>Vos articles actuels dans le panier</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    <ProductSkeleton count={3} />
                  </div>
                ) : cartProducts.length > 0 ? (
                  <div className="space-y-4">
                    {cartProducts.slice(0, 3).map(item => (
                      <div key={item.productId} className="flex items-center gap-3 p-3 border rounded-lg">
                        <img 
                          src={item.product?.images[0] || '/favicon.svg'} 
                          alt={item.product?.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.product?.name}</h4>
                          <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                          <p className="text-sm text-primary font-medium">
                            {((item.product?.discounted_price || item.product?.original_price || 0) * item.quantity).toLocaleString()} FC
                          </p>
                        </div>
                      </div>
                    ))}
                    {cartProducts.length > 3 && (
                      <Link to="/cart">
                        <Button variant="ghost" className="w-full">
                          Voir tout le panier ({cartProducts.length})
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Votre panier est vide</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
              <CardDescription>Gérez votre compte et vos préférences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link to="/cart">
                  <Button variant="outline" className="h-20 flex flex-col gap-2 w-full">
                    <Package className="h-5 w-5" />
                    <span className="text-xs">Mes Commandes</span>
                  </Button>
                </Link>
                <Link to="/favorites">
                  <Button variant="outline" className="h-20 flex flex-col gap-2 w-full">
                    <Heart className="h-5 w-5" />
                    <span className="text-xs">Favoris</span>
                  </Button>
                </Link>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <User className="h-5 w-5" />
                  <span className="text-xs">Profil</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Mail className="h-5 w-5" />
                  <span className="text-xs">Support</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Account;
