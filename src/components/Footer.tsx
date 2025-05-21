
import { Link } from 'react-router-dom';
import WhatsAppContact from './WhatsAppContact';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900/40 py-3">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-2 md:mb-0">
            <h3 className="text-sm font-semibold">BeShop Congo</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your trusted online shopping destination
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2 md:mb-0">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          
          <WhatsAppContact 
            phoneNumber="243978100940" 
            message="Hello! I would like to know more about your products."
            variant="outline"
            size="sm"
            className="text-xs"
          >
            +243 978 100 940
          </WhatsAppContact>
        </div>
        
        <Separator className="my-2" />
        
        <div className="text-center text-xs text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} BeShop Congo</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
