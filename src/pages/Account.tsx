
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Heart, Settings, LogOut, ShoppingBag } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthForm from '@/components/AuthForm';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserOrders } from '@/hooks/useUserOrders';
import { useUserFavorites } from '@/hooks/useUserFavorites';
import { formatPrice } from '@/lib/utils';

const Account = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const { profile } = useUserProfile();
  const { orders } = useUserOrders();
  const { favorites } = useUserFavorites();
  const [showAuthForm, setShowAuthForm] = useState(false);

  const handleAuthSuccess = () => {
    setShowAuthForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Livré';
      case 'shipped':
        return 'Expédié';
      case 'processing':
        return 'En traitement';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Mon Compte</h1>
              <p className="text-muted-foreground mb-6">
                Connectez-vous pour accéder à vos commandes, favoris et gérer votre compte
              </p>
            </div>

            {!showAuthForm ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-6"
              >
                <div className="bg-muted/50 p-8 rounded-lg">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Accédez à votre espace personnel</h2>
                  <p className="text-muted-foreground mb-6">
                    Suivez vos commandes, gérez vos favoris et personnalisez votre expérience d'achat
                  </p>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={() => setShowAuthForm(true)}
                      size="lg"
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold px-8 py-3 rounded-full shadow-lg"
                    >
                      Se connecter / Créer un compte
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <AuthForm onSuccess={handleAuthSuccess} />
            )}
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mon Compte</h1>
              <p className="text-muted-foreground">
                Bienvenue, {profile?.full_name || user?.email}
              </p>
            </div>
            <Button variant="outline" onClick={signOut} className="mt-4 md:mt-0">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Mes Commandes
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Mes Favoris
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profil
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Mes Commandes</CardTitle>
                  <CardDescription>
                    Suivez l'état de vos commandes et consultez votre historique d'achats
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Vous n'avez pas encore passé de commande</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                            <div>
                              <h3 className="font-semibold">Commande #{order.order_number}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <div className="flex items-center gap-4 mt-2 md:mt-0">
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusText(order.status)}
                              </Badge>
                              <span className="font-semibold">
                                {formatPrice(order.total_amount)} FC
                              </span>
                            </div>
                          </div>
                          
                          {order.order_items && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-4">
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3 text-sm">
                                  {item.product_image && (
                                    <img 
                                      src={item.product_image} 
                                      alt={item.product_name}
                                      className="w-10 h-10 rounded object-cover"
                                    />
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium">{item.product_name}</p>
                                    <p className="text-muted-foreground">
                                      Qté: {item.quantity} × {formatPrice(item.unit_price)} FC
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites">
              <Card>
                <CardHeader>
                  <CardTitle>Mes Favoris</CardTitle>
                  <CardDescription>
                    Retrouvez tous vos produits préférés en un seul endroit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {favorites.length === 0 ? (
                    <div className="text-center py-8">
                      <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Vous n'avez pas encore de favoris</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {favorites.map((favorite) => (
                        <motion.div
                          key={favorite.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ProductCard product={favorite.products} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du Profil</CardTitle>
                  <CardDescription>
                    Gérez vos informations personnelles et préférences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Email</label>
                        <p className="text-muted-foreground">{user?.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Nom complet</label>
                        <p className="text-muted-foreground">{profile?.full_name || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Téléphone</label>
                        <p className="text-muted-foreground">{profile?.phone || 'Non renseigné'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Membre depuis</label>
                        <p className="text-muted-foreground">
                          {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                        </p>
                      </div>
                    </div>
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
