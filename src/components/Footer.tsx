
import { Link } from 'react-router-dom';
import WhatsAppContact from './WhatsAppContact';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900/40 py-3">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-2 md:mb-0">
            <h3 className="text-sm font-semibold">BeShopping Congo</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Votre destination de shopping en ligne de confiance
            </p>
            <a 
              href="https://www.beprogress.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              www.beprogress.org
            </a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2 md:mb-0">
            <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
            <Link to="/products" className="hover:text-primary transition-colors">Produits</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          
          <WhatsAppContact 
            phoneNumber="243978100940" 
            message="Bonjour ! J'aimerais en savoir plus sur vos produits."
            variant="outline"
            size="sm"
            className="text-xs"
          >
            +243 978 100 940
          </WhatsAppContact>
        </div>
        
        <Separator className="my-2" />
        
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} BeShopping Congo</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
