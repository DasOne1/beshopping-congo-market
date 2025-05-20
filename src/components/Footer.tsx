
import { Link } from 'react-router-dom';
import WhatsAppContact from './WhatsAppContact';
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-10 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">BeShop Congo</h3>
            <p className="text-sm text-gray-600 mb-4">
              Your trusted online shopping destination in Congo. Quality products with fast delivery and excellent customer service.
            </p>
            <WhatsAppContact 
              phoneNumber="243123456789" 
              message="Hello! I would like to know more about your products."
              variant="outline"
              className="mb-2 w-full"
            >
              Contact Support
            </WhatsAppContact>
            <p className="text-xs text-gray-500 mt-2">
              Business hours: Mon-Sat, 8am - 6pm
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-600 hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shipping" className="text-gray-600 hover:text-primary transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 hover:text-primary transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div className="text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} BeShop Congo. All rights reserved.</p>
          <p className="mt-2">
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
