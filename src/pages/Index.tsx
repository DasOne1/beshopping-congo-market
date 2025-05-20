
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ProductCard from '@/components/ProductCard';
import WhatsAppContact from '@/components/WhatsAppContact';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockProducts, mockCategories } from '@/data/mockData';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("featured");
  
  // Get featured products
  const featuredProducts = mockProducts.filter(product => product.featured);
  
  // Get most popular products
  const popularProducts = [...mockProducts].sort((a, b) => b.popular - a.popular);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-accent py-10">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to BeShop Congo</h1>
              <p className="text-lg mb-6">Your trusted online shopping destination in Congo</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <Link to="/products">Browse Products</Link>
                </Button>
                <WhatsAppContact 
                  phoneNumber="243123456789"
                  message="Hello! I'm interested in shopping with BeShop."
                  variant="outline"
                  size="lg"
                >
                  Contact Support
                </WhatsAppContact>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-8">
          <div className="container">
            <h2 className="text-xl md:text-2xl font-semibold mb-4">Shop by Category</h2>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4 py-4">
                {mockCategories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.slug}`}
                    className="flex flex-col items-center space-y-2 min-w-[100px]"
                  >
                    <div className="bg-muted rounded-full h-20 w-20 flex items-center justify-center">
                      <div className="text-xl">{category.name.charAt(0)}</div>
                    </div>
                    <span className="text-sm font-medium">{category.name}</span>
                  </Link>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </section>

        {/* Products Tabs Section */}
        <section className="py-8">
          <div className="container">
            <Tabs defaultValue="featured" onValueChange={setActiveTab} value={activeTab}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-semibold">Our Products</h2>
                <TabsList>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                  <TabsTrigger value="popular">Most Popular</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="featured" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="popular" className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {popularProducts.slice(0, 8).map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TabsContent>
              
              <div className="mt-6 text-center">
                <Button asChild variant="outline">
                  <Link to="/products">View All Products</Link>
                </Button>
              </div>
            </Tabs>
          </div>
        </section>

        {/* WhatsApp Support Banner */}
        <section className="bg-whatsapp/10 py-8">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Need Help Shopping?</h2>
                <p className="text-gray-600 max-w-md">
                  Our customer support team is ready to assist you through WhatsApp.
                </p>
              </div>
              <WhatsAppContact
                phoneNumber="243123456789"
                message="Hello! I need assistance with shopping on BeShop."
                className="bg-whatsapp hover:bg-whatsapp-dark"
                size="lg"
              >
                Chat with Us on WhatsApp
              </WhatsAppContact>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-10">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-accent rounded-lg p-6 text-center">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Quality Products</h3>
                <p className="text-sm text-gray-600">
                  We ensure that all our products meet high quality standards.
                </p>
              </div>
              
              <div className="bg-accent rounded-lg p-6 text-center">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Fast Delivery</h3>
                <p className="text-sm text-gray-600">
                  Quick delivery service to get your products to you as soon as possible.
                </p>
              </div>
              
              <div className="bg-accent rounded-lg p-6 text-center">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600">
                  Our customer support team is always ready to assist you.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
