
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4">
        <motion.div 
          className="container py-16 text-center max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-8xl md:text-9xl font-bold text-primary/20 mb-4">404</h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Page introuvable
            </h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée. 
              Elle a peut-être été supprimée ou vous avez tapé une mauvaise adresse.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button asChild size="lg" className="min-w-[160px]">
              <Link to="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="min-w-[160px]">
              <Link to="/products" className="flex items-center">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Voir nos produits
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="ghost" 
              size="lg"
              className="min-w-[160px]"
            >
              <button onClick={() => window.history.back()} className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Page précédente
              </button>
            </Button>
          </motion.div>

          <motion.div
            className="mt-12 p-6 bg-muted/50 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="font-semibold mb-2 text-foreground">Besoin d'aide ?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Si vous pensez qu'il s'agit d'une erreur, n'hésitez pas à nous contacter.
            </p>
            <Button asChild variant="link" size="sm">
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
