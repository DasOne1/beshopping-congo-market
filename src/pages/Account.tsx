
import React from 'react';
import { motion } from 'framer-motion';
import { User, Package, Heart, Settings, LogOut } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserOrders } from '@/hooks/useUserOrders';
import { useUserFavorites } from '@/hooks/useUserFavorites';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/AuthForm';

const Account = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();
  const { orders, isLoading: ordersLoading } = useUserOrders();
  const { favorites, isLoading: favoritesLoading } = useUserFavorites();

  const handleSignOut = async () => {
    await signOut.mutateAsync();
    navigate('/');
  };

  // Si l'utilisateur n'est pas connecté, afficher le formulaire d'authentification
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            <h1 className="text-2xl font-bold text-center mb-8">Mon Compte</h1>
            <AuthForm />
          </motion.div>
        </div>

        <Footer />
      </div>
    );
  }

  // Si l'utilisateur est connecté, afficher les informations du compte
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Mon Compte</h1>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Profil */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profil
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profileLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium">{profile?.full_name || user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {profile?.phone && (
                      <p className="text-sm text-muted-foreground">{profile.phone}</p>
                    )}
                    <Button variant="outline" size="sm" className="mt-3">
                      <Settings className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Commandes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Mes Commandes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{orders?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">
                      {orders?.length === 0 ? 'Aucune commande' : 
                       orders?.length === 1 ? 'commande passée' : 'commandes passées'}
                    </p>
                    {orders && orders.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground">Dernière commande:</p>
                        <p className="text-sm font-medium">#{orders[0].order_number}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(orders[0].created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Favoris */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Mes Favoris
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favoritesLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">{favorites?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">
                      {favorites?.length === 0 ? 'Aucun favori' : 
                       favorites?.length === 1 ? 'produit favori' : 'produits favoris'}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => navigate('/favorites')}
                    >
                      Voir mes favoris
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Commandes récentes */}
          {orders && orders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-8"
            >
              <h2 className="text-xl font-semibold mb-4">Commandes récentes</h2>
              <div className="space-y-4">
                {orders.slice(0, 3).map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">#{order.order_number}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-sm">
                            Statut: <span className={`capitalize ${
                              order.status === 'delivered' ? 'text-green-600' :
                              order.status === 'pending' ? 'text-yellow-600' :
                              order.status === 'processing' ? 'text-blue-600' :
                              'text-gray-600'
                            }`}>
                              {order.status === 'pending' ? 'En attente' :
                               order.status === 'processing' ? 'En cours' :
                               order.status === 'shipped' ? 'Expédiée' :
                               order.status === 'delivered' ? 'Livrée' :
                               order.status}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {order.total_amount.toLocaleString('fr-FR')} FC
                          </p>
                          {order.order_items && order.order_items.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              {order.order_items.length} article{order.order_items.length > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Account;
