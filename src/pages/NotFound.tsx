
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="container py-16 text-center">
          <h1 className="text-7xl md:text-9xl font-bold text-primary/20">404</h1>
          <p className="text-2xl md:text-3xl font-medium mb-4">Page Not Found</p>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link to="/">
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/products">
                Browse Products
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
