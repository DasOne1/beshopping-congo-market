import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Award, Truck, Shield, Star, MapPin, Phone, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-20 md:pt-24 pb-20 md:pb-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary">
            À propos de nous
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            BeShopping Congo
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Votre partenaire de confiance pour les achats en ligne au Congo. 
            Nous nous engageons à vous offrir les meilleurs produits avec un service exceptionnel.
          </p>
        </motion.div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-primary" />
                  Notre Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Démocratiser l'accès aux produits de qualité pour tous les Congolais, 
                  en offrant une expérience d'achat en ligne simple, sécurisée et fiable.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-primary" />
                  Notre Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Devenir la première plateforme e-commerce du Congo, 
                  reconnue pour la qualité de ses produits et l'excellence de son service client.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Confiance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nous garantissons la sécurité de vos transactions et la qualité de nos produits.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nous nous efforçons d'offrir le meilleur service et les produits de la plus haute qualité.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Proximité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nous sommes à l'écoute de nos clients et adaptons nos services à leurs besoins.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Nos Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Livraison Rapide</h3>
              <p className="text-sm text-muted-foreground">
                Livraison dans toute la ville de Lubumbashi et ses environs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Paiement Sécurisé</h3>
              <p className="text-sm text-muted-foreground">
                Transactions sécurisées et multiples options de paiement
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Produits Authentiques</h3>
              <p className="text-sm text-muted-foreground">
                Garantie d'authenticité sur tous nos produits
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Support Client</h3>
              <p className="text-sm text-muted-foreground">
                Équipe dédiée pour vous accompagner 24h/7j
              </p>
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-primary/5 rounded-lg p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Nos Réalisations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <p className="text-muted-foreground">Clients Satisfaits</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <p className="text-muted-foreground">Produits</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Catégories</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">Support Client</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Contactez-nous</CardTitle>
              <CardDescription className="text-center">
                Nous sommes là pour vous aider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="flex flex-col items-center">
                  <MapPin className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Adresse</h3>
                  <p className="text-sm text-muted-foreground">
                    Lubumbashi, République Démocratique du Congo
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <Phone className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Téléphone</h3>
                  <p className="text-sm text-muted-foreground">
                    +243 974 984 449
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <Mail className="h-8 w-8 text-primary mb-2" />
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-sm text-muted-foreground">
                    contact@beshopping.cd
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      
      <div className="pb-16 md:pb-0">
        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;
