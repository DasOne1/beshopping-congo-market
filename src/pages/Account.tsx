
import React from 'react';
import { User, MessageCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const Account = () => {
  // Simulation des données utilisateur
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+243 123 456 789',
    joinDate: '2024-01-15',
    totalOrders: 12,
    totalSpent: 450000
  };

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = '+243978100940';
    const message = encodeURIComponent('Bonjour BeShop Congo ! Je souhaite entrer en contact avec vous.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
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
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{user.totalOrders}</div>
                  <div className="text-sm text-muted-foreground">Commandes</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">Premium</div>
                  <div className="text-sm text-muted-foreground">Statut</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{formatPrice(user.totalSpent)} FC</div>
                  <div className="text-sm text-muted-foreground">Total dépensé</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="text-center p-8 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-10 w-10 text-primary" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Merci pour votre confiance !
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Chez BeShop Congo, nous sommes reconnaissants de vous compter parmi nos clients privilégiés. 
                    Votre satisfaction est notre priorité et nous continuons à travailler pour vous offrir 
                    les meilleurs produits et le meilleur service.
                  </p>
                  <p className="text-muted-foreground">
                    Pour toute question, suggestion ou assistance, n'hésitez pas à nous contacter directement via WhatsApp.
                  </p>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={handleWhatsAppContact}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                    size="lg"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Nous contacter sur WhatsApp
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    Numéro : +243 978100940
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Account;
