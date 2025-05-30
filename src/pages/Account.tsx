
import React, { useState } from 'react';
import { User, Heart, ShoppingBag, Package, Settings, LogOut, Edit } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useProducts } from '@/hooks/useProducts';
import { motion } from 'framer-motion';

const Account = () => {
  const { favorites } = useFavorites();
  const { products } = useProducts();
  const [activeTab, setActiveTab] = useState('favorites');
  
  // Simulation des données utilisateur
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+243 123 456 789',
    joinDate: '2024-01-15',
    totalOrders: 12,
    totalSpent: 450000
  };

  // Produits favoris
  const favoriteProducts = products.filter(product => 
    favorites.includes(product.id)
  );

  // Simulation des commandes (ici on utilise les produits populaires comme exemple)
  const orderedProducts = products.filter(product => 
    product.popular && product.popular > 10
  ).slice(0, 6);

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-8 text-foreground flex items-center">
            <User className="mr-3 h-8 w-8" />
            Mon Compte
          </h1>

          {/* Profile Info Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{user.name}</CardTitle>
                    <p className="text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">Membre depuis {new Date(user.joinDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{user.totalOrders}</div>
                  <div className="text-sm text-muted-foreground">Commandes</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{favoriteProducts.length}</div>
                  <div className="text-sm text-muted-foreground">Favoris</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{formatPrice(user.totalSpent)} FC</div>
                  <div className="text-sm text-muted-foreground">Total dépensé</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different sections */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Favoris</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Commandes</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Profil</span>
              </TabsTrigger>
              <TabsTrigger value="logout" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </TabsTrigger>
            </TabsList>

            {/* Favorites Tab */}
            <TabsContent value="favorites" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Mes Produits Favoris</h2>
                  <Badge variant="secondary">{favoriteProducts.length} produits</Badge>
                </div>
                
                {favoriteProducts.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Heart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucun favori</h3>
                    <p className="text-muted-foreground mb-4">
                      Vous n'avez pas encore ajouté de produits à vos favoris.
                    </p>
                    <Button onClick={() => window.location.href = '/products'}>
                      Parcourir les produits
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {favoriteProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ProductCard product={product} viewMode="single" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Mes Commandes</h2>
                  <Badge variant="secondary">{orderedProducts.length} produits commandés</Badge>
                </div>
                
                {orderedProducts.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Aucune commande</h3>
                    <p className="text-muted-foreground mb-4">
                      Vous n'avez pas encore passé de commande.
                    </p>
                    <Button onClick={() => window.location.href = '/products'}>
                      Commencer vos achats
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orderedProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <ProductCard product={product} viewMode="single" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du Profil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Nom complet</label>
                      <p className="text-foreground">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-foreground">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                      <p className="text-foreground">{user.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Date d'inscription</label>
                      <p className="text-foreground">{new Date(user.joinDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button>
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier les informations
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Logout Tab */}
            <TabsContent value="logout" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Déconnexion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Êtes-vous sûr de vouloir vous déconnecter ?
                  </p>
                  <div className="flex gap-4">
                    <Button variant="destructive">
                      <LogOut className="h-4 w-4 mr-2" />
                      Se déconnecter
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab('favorites')}>
                      Annuler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
