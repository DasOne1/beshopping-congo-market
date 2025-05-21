
import { Link } from 'react-router-dom';
import WhatsAppContact from './WhatsAppContact';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900/40 py-6">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-base font-semibold mb-3">BeShop Congo</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
              Your trusted online shopping destination in Congo.
            </p>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-3">Info</h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/shipping" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-3">Contact</h3>
            <div className="space-y-2">
              <WhatsAppContact 
                phoneNumber="243978100940" 
                message="Hello! I would like to know more about your products."
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                +243 978 100 940
              </WhatsAppContact>
              <WhatsAppContact 
                phoneNumber="243974984449" 
                message="Hello! I would like to know more about your products."
                variant="outline"
                size="sm"
                className="w-full text-xs"
              >
                +243 974 984 449
              </WhatsAppContact>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
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
