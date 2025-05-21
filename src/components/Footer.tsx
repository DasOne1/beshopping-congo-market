
import { Link } from 'react-router-dom';
import WhatsAppContact from './WhatsAppContact';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900/40 py-4">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-base font-semibold mb-1">BeShop Congo</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Your trusted online shopping destination
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 md:mb-0">
            <Link to="/" className="text-xs text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-xs text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-xs text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-xs text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
          
          <div className="flex flex-wrap gap-2">
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
        </div>
        
        <Separator className="my-2" />
        
        <div className="text-center text-xs text-gray-600 dark:text-gray-400">
          <p>© {new Date().getFullYear()} BeShop Congo. All rights reserved.</p>
          <p className="mt-1">
            <Link to="/admin" className="text-xs text-gray-500 hover:text-primary transition-colors">
              Admin Portal
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
