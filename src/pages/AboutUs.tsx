
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Fondatrice & PDG',
      bio: 'Avec plus de 10 ans d\'expérience dans le commerce de détail, Sarah a fondé BeShop avec la vision de transformer le e-commerce au Congo.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
      id: 2,
      name: 'Jean Pierre Lokonga',
      role: 'Directeur des Opérations',
      bio: 'Jean supervise tous les aspects de nos opérations, garantissant une livraison fluide et un service client exceptionnel.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
      id: 3,
      name: 'Marie Mutombo',
      role: 'Relations Clientèle',
      bio: 'Marie dirige notre équipe de support client, se concentrant sur la construction de relations solides avec nos précieux clients.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
      id: 4,
      name: 'David Mbemba',
      role: 'Spécialiste Produits',
      bio: 'David s\'assure que nous ne proposons que des produits de la plus haute qualité pour nos clients à travers le Congo.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
    }
  ];

  const achievements = [
    { number: '5 000+', label: 'Clients Satisfaits' },
    { number: '99%', label: 'Taux de Satisfaction' },
    { number: '24/7', label: 'Support Client' },
    { number: '1 200+', label: 'Produits Disponibles' }
  ];
  
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Section Héros */}
        <section className="py-16 bg-accent/20">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-5xl font-bold mb-4">À Propos de BeShop Congo</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Nous construisons l'avenir du e-commerce au Congo, un client satisfait à la fois.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild>
                    <Link to="/products">Explorer les Produits</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/contact">Nous Contacter</Link>
                  </Button>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1516733968668-dbdce39c4651?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Magasin BeShop" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-sm font-medium">Notre mission est de fournir des produits de qualité avec un service exceptionnel</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Notre Histoire */}
        <section className="py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Notre Histoire</h2>
              <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full" />
              <p className="text-lg">
                Fondé en 2022, BeShop Congo est né d'une idée simple : rendre les achats en ligne accessibles, 
                pratiques et fiables pour tous en République Démocratique du Congo. 
                Ce qui a commencé comme une petite opération est devenu la place de marché en ligne la plus fiable du Congo.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-2xl font-semibold">Notre Vision</h3>
                <p>
                  Être la plateforme e-commerce leader au Congo, révolutionnant la façon dont les gens font leurs achats en 
                  fournissant un accès facile à des produits de qualité et un service client exceptionnel.
                </p>
                
                <h3 className="text-2xl font-semibold pt-4">Notre Mission</h3>
                <p>
                  Nous nous efforçons de rendre les achats en ligne accessibles à tous les Congolais en offrant :
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Des produits authentiques de haute qualité à des prix compétitifs</li>
                  <li>Un service client exceptionnel et personnalisé via WhatsApp</li>
                  <li>Une expérience d'achat conviviale optimisée pour les appareils mobiles</li>
                  <li>Des options de livraison fiables dans tout le Congo</li>
                </ul>
              </motion.div>
              
              <motion.div
                className="grid grid-cols-2 gap-4"
                variants={containerAnimation}
                initial="hidden"
                animate="visible"
              >
                {achievements.map((item, index) => (
                  <motion.div 
                    key={index} 
                    variants={itemAnimation}
                  >
                    <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm h-full">
                      <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                        <div className="text-3xl font-bold text-primary mb-2">{item.number}</div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Valeurs Fondamentales */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Nos Valeurs</h2>
              <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full" />
              <p className="text-lg">
                Chez BeShop Congo, nous sommes guidés par un ensemble de valeurs fondamentales qui définissent qui nous sommes et comment nous opérons.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>
                        <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
                        <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Qualité</h3>
                    <p className="text-muted-foreground flex-1">
                      Nous ne proposons que des produits qui répondent à nos normes de qualité strictes. Chaque article est soigneusement sélectionné pour garantir la satisfaction du client.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M8.8 19a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/>
                        <path d="M3 14v-3a7 7 0 0 1 11.5-5.4"/>
                        <path d="M21 12v3a7 7 0 0 1-11.5 5.4"/>
                        <path d="m21 9-5-5"/>
                        <path d="m16 4 5 5"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Confiance</h3>
                    <p className="text-muted-foreground flex-1">
                      Nous construisons la confiance par la transparence, des produits authentiques et un service fiable. Votre confiance en nous est notre atout le plus précieux.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="m8 14 6-6"/>
                        <path d="M13.5 8.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
                        <path d="M10.5 15.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Accessibilité</h3>
                    <p className="text-muted-foreground flex-1">
                      Nous rendons les achats en ligne accessibles à tous les Congolais en optimisant pour mobile, en offrant un support WhatsApp et en garantissant une expérience fluide.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section Équipe */}
        <section className="py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Rencontrez Notre Équipe</h2>
              <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full" />
              <p className="text-lg">
                Les professionnels dévoués derrière BeShop Congo sont engagés à vous fournir la meilleure expérience d'achat en ligne.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
            >
              {teamMembers.map((member) => (
                <motion.div key={member.id} variants={itemAnimation}>
                  <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="aspect-square relative overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-sm text-primary mb-2">{member.role}</p>
                      <p className="text-sm text-muted-foreground">{member.bio}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Appel à l'Action */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold mb-4">Prêt à Acheter avec BeShop ?</h2>
              <p className="text-lg mb-8 opacity-90">
                Rejoignez des milliers de clients satisfaits qui font confiance à BeShop Congo pour leurs besoins d'achat.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild 
                  variant="secondary" 
                  size="lg"
                >
                  <Link to="/products">Parcourir les Produits</Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  <Link to="/contact">Nous Contacter</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
