
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, ShoppingBag, Heart, LogOut, Lock, Mail, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import { toast } from 'sonner';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  
  // Récupération des données depuis la base de données
  const { orders } = useOrders();
  const { products } = useProducts();
  
  // Données utilisateur fictives (à remplacer par de vraies données utilisateur)
  const user = {
    name: 'Utilisateur',
    email: 'user@example.com',
    phone: '+243 123 456 789',
    address: '123 Main St, Kinshasa',
    avatarUrl: null,
  };

  // Utilisation des vraies commandes depuis la base de données
  const userOrders = orders?.slice(0, 5) || [];
  
  // Produits récemment vus (utilisation des produits populaires)
  const recentlyViewed = products?.filter(p => p.popular && p.popular > 80).slice(0, 4) || [];

  // Handle form submissions
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profil mis à jour avec succès');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Mot de passe modifié avec succès');
  };
  
  const handleAddressUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Adresse mise à jour avec succès');
  };

  const handleLogout = () => {
    toast.info('Déconnexion réussie');
  };

  return (
    <div className="flex flex-col min-h-screen pb-16 md:pb-0">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="w-full md:w-1/3">
                <Card className="glass-effect">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-center">Mon Compte</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={user.avatarUrl || ''} alt={user.name} />
                      <AvatarFallback className="text-2xl bg-primary text-white">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{user.phone}</p>
                    
                    <Separator className="my-4" />
                    
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                        <TabsTrigger value="profile" className="flex items-center justify-start">
                          <User className="h-4 w-4 mr-2" />
                          <span>Profil</span>
                        </TabsTrigger>
                        <TabsTrigger value="orders" className="flex items-center justify-start">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          <span>Commandes</span>
                        </TabsTrigger>
                        <TabsTrigger value="favorites" className="flex items-center justify-start">
                          <Heart className="h-4 w-4 mr-2" />
                          <span>Favoris</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          <span>Paramètres</span>
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    
                    <Button 
                      variant="ghost" 
                      className="mt-6 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Déconnexion</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="w-full md:w-2/3">
                <Tabs value={activeTab}>
                  <TabsContent value="profile" className="mt-0">
                    <Card className="glass-effect">
                      <CardHeader>
                        <CardTitle>Informations Personnelles</CardTitle>
                        <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Nom Complet</Label>
                              <Input id="name" defaultValue={user.name} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" type="email" defaultValue={user.email} />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="phone">Téléphone</Label>
                              <Input id="phone" defaultValue={user.phone} />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="avatar">Photo de Profil</Label>
                              <Input id="avatar" type="file" />
                            </div>
                          </div>
                          
                          <Button type="submit">Sauvegarder</Button>
                        </form>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Informations d'Adresse</h3>
                          <form onSubmit={handleAddressUpdate} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="address">Adresse</Label>
                              <Input id="address" defaultValue={user.address} />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="city">Ville</Label>
                                <Input id="city" defaultValue="Kinshasa" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="province">Province</Label>
                                <Input id="province" defaultValue="Kinshasa" />
                              </div>
                            </div>
                            
                            <Button type="submit">Mettre à jour l'adresse</Button>
                          </form>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium mb-4">Sécurité</h3>
                          <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                              <Input id="currentPassword" type="password" />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                                <Input id="newPassword" type="password" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                                <Input id="confirmPassword" type="password" />
                              </div>
                            </div>
                            
                            <Button type="submit">Changer le mot de passe</Button>
                          </form>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="orders" className="mt-0">
                    <Card className="glass-effect">
                      <CardHeader>
                        <CardTitle>Historique des Commandes</CardTitle>
                        <CardDescription>Suivez et gérez vos commandes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {userOrders.length > 0 ? (
                          <div className="space-y-4">
                            {userOrders.map((order) => (
                              <Card key={order.id}>
                                <CardHeader className="py-3">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <CardTitle className="text-sm font-medium">{order.order_number}</CardTitle>
                                      <CardDescription>{new Date(order.created_at).toLocaleDateString('fr-FR')}</CardDescription>
                                    </div>
                                    <div className="text-right">
                                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                        order.status === 'delivered' 
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                          : order.status === 'cancelled'
                                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                      }`}>
                                        {order.status}
                                      </span>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent className="py-2">
                                  <div className="flex justify-between items-center">
                                    <p className="text-sm">Commande #{order.order_number}</p>
                                    <p className="font-medium">{order.total_amount.toLocaleString()} CDF</p>
                                  </div>
                                </CardContent>
                                <CardFooter className="pt-0 pb-3 flex justify-end">
                                  <Button variant="outline" size="sm">
                                    Voir les détails
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                            <h3 className="mt-2 text-lg font-medium">Aucune commande</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Vos commandes apparaîtront ici</p>
                            <Button className="mt-4" asChild>
                              <a href="/products">Commencer les achats</a>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="favorites" className="mt-0">
                    <Card className="glass-effect">
                      <CardHeader>
                        <CardTitle>Favoris</CardTitle>
                        <CardDescription>Produits que vous avez sauvegardés</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {recentlyViewed.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recentlyViewed.map((product) => (
                              <ProductCard key={product.id} product={product} />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Heart className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                            <h3 className="mt-2 text-lg font-medium">Aucun favori</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Vos produits favoris apparaîtront ici</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="settings" className="mt-0">
                    <Card className="glass-effect">
                      <CardHeader>
                        <CardTitle>Paramètres du Compte</CardTitle>
                        <CardDescription>Gérez vos préférences de compte</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Préférences de Thème</h3>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`p-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-orange-100'}`}>
                                {darkMode ? (
                                  <Moon className="h-5 w-5 text-white" />
                                ) : (
                                  <Sun className="h-5 w-5 text-orange-600" />
                                )}
                              </div>
                              <div>
                                <Label>Mode Sombre</Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {darkMode ? 'Passer au mode clair' : 'Passer au mode sombre'}
                                </p>
                              </div>
                            </div>
                            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Préférences de Notification</h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <Label>Notifications Push</Label>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Recevoir des notifications pour les commandes et promotions
                              </p>
                            </div>
                            <Switch checked={notifications} onCheckedChange={setNotifications} />
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Préférences de Communication</h3>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span className="text-sm">Email: {user.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span className="text-sm">Téléphone: {user.phone}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" className="mt-2">
                              <Mail className="h-4 w-4 mr-2" />
                              Mettre à jour l'email
                            </Button>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Phone className="h-4 w-4 mr-2" />
                              Mettre à jour le téléphone
                            </Button>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium text-red-600 dark:text-red-400">Zone de Danger</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Supprimer définitivement votre compte et toutes les données
                          </p>
                          <Button variant="destructive">Supprimer le Compte</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            
            {recentlyViewed.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Produits Récemment Vus</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {recentlyViewed.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Helper components
const Moon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const Sun = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

export default AccountPage;
