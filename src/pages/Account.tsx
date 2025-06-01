
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Package, Heart, ShoppingCart, Phone, Mail, MapPin, Calendar, Edit, LogOut, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/useProducts';
import ProductSkeleton from '@/components/ProductSkeleton';
import { motion } from 'framer-motion';
import { useCustomerAuth } from '@/hooks/useCustomerAuth';

const Account = () => {
  const { favorites } = useFavorites();
  const { cart } = useCart();
  const { products, isLoading } = useProducts();
  const { currentCustomer, isAuthenticated, loading, signUp, signIn, signOut, updateProfile } = useCustomerAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authForm, setAuthForm] = useState({ phone: '', password: '' });
  const [profileForm, setProfileForm] = useState({
    name: currentCustomer?.name || '',
    email: currentCustomer?.email || '',
    phone: currentCustomer?.phone || '',
    address: currentCustomer?.address || ''
  });

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

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signUp({
          name: profileForm.name,
          email: profileForm.email,
          phone: authForm.phone,
          address: profileForm.address
        }, authForm.password);
      } else {
        await signIn(authForm);
      }
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      setIsEditing(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-20 md:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LogIn className="mr-2 h-5 w-5" />
                  {isSignUp ? 'Créer un compte' : 'Se connecter'}
                </CardTitle>
                <CardDescription>
                  {isSignUp 
                    ? 'Créez votre compte pour commencer vos achats'
                    : 'Connectez-vous à votre compte'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {isSignUp && (
                    <>
                      <div>
                        <Label htmlFor="name">Nom complet</Label>
                        <Input
                          id="name"
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email (optionnel)</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Adresse (optionnel)</Label>
                        <Textarea
                          id="address"
                          value={profileForm.address}
                          onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                        />
                      </div>
                    </>
                  )}
                  
                  <div>
                    <Label htmlFor="phone">Numéro de téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={authForm.phone}
                      onChange={(e) => setAuthForm({...authForm, phone: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={authForm.password}
                      onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Chargement...' : (isSignUp ? 'Créer le compte' : 'Se connecter')}
                  </Button>
                </form>
                
                <div className="mt-4 text-center">
                  <Button
                    variant="link"
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm"
                  >
                    {isSignUp 
                      ? 'Déjà un compte ? Se connecter'
                      : 'Pas de compte ? Créer un compte'
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-20 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <User className="mr-2 h-6 w-6" />
              Mon Compte
            </h1>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* User Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Profil Utilisateur
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="edit-name">Nom complet</Label>
                      <Input
                        id="edit-name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-phone">Téléphone</Label>
                      <Input
                        id="edit-phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-address">Adresse</Label>
                      <Textarea
                        id="edit-address"
                        value={profileForm.address}
                        onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading}>
                        Sauvegarder
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                        Annuler
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{currentCustomer?.name}</span>
                    </div>
                    {currentCustomer?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{currentCustomer.email}</span>
                      </div>
                    )}
                    {currentCustomer?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{currentCustomer.phone}</span>
                      </div>
                    )}
                    {currentCustomer?.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{currentCustomer.address}</span>
                      </div>
                    )}
                  </div>
                )}
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
                          src={product.images[0] || '/shopping_logo.png'} 
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
                          src={item.product?.images[0] || '/shopping_logo.png'} 
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
                <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setIsEditing(true)}>
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
