
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, Star, Globe } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              À propos de BeShopping Congo
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Votre partenaire de confiance pour le shopping en ligne en République Démocratique du Congo
            </p>
          </div>

          {/* Notre mission */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Notre Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Chez BeShopping Congo, nous nous engageons à révolutionner l'expérience du shopping en ligne 
                  en République Démocratique du Congo. Notre mission est de fournir une plateforme accessible, 
                  fiable et sécurisée qui connecte les consommateurs congolais aux meilleurs produits disponibles 
                  sur le marché.
                </p>
              </CardContent>
            </Card>
          </motion.section>

          {/* Nos valeurs */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Nos Valeurs</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Qualité</h3>
                  <p className="text-muted-foreground">
                    Nous sélectionnons soigneusement chaque produit pour garantir 
                    la meilleure qualité à nos clients.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Service Client</h3>
                  <p className="text-muted-foreground">
                    Notre équipe dédiée est disponible pour vous accompagner 
                    à chaque étape de votre expérience d'achat.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Accessibilité</h3>
                  <p className="text-muted-foreground">
                    Nous rendons le shopping en ligne accessible à tous les Congolais, 
                    partout dans le pays.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* Notre histoire */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Notre Histoire</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  BeShopping Congo est né de la vision de démocratiser l'accès aux produits de qualité 
                  pour tous les Congolais. Fondée par une équipe passionnée de professionnels du commerce 
                  électronique, notre plateforme a été conçue pour répondre aux besoins spécifiques du 
                  marché congolais.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Depuis notre lancement, nous avons établi des partenariats solides avec des fournisseurs 
                  de confiance et développé un réseau de livraison efficace qui couvre les principales 
                  villes du pays. Notre engagement envers l'excellence nous a permis de gagner la confiance 
                  de milliers de clients satisfaits.
                </p>
              </CardContent>
            </Card>
          </motion.section>

          {/* Contact et site officiel */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-4">Rejoignez-nous</h3>
                <p className="text-muted-foreground mb-6">
                  Découvrez pourquoi des milliers de Congolais font confiance à BeShopping 
                  pour leurs achats en ligne.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button asChild size="lg">
                    <a 
                      href="https://www.beprogress.org" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Visitez notre site officiel
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href="/contact">
                      Nous contacter
                    </a>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Site officiel : 
                  <a 
                    href="https://www.beprogress.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors ml-1"
                  >
                    www.beprogress.org
                  </a>
                </p>
              </CardContent>
            </Card>
          </motion.section>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
