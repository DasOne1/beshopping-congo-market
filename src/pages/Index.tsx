
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
import { FeaturedGallery } from '@/components/FeaturedGallery';
import { mockProducts, mockCategories } from '@/data/mockData';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("featured");
  
  // Get featured products
  const featuredProducts = mockProducts.filter(product => product.featured);
  
  // Get most popular products
  const popularProducts = [...mockProducts].sort((a, b) => b.popular - a.popular);

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
        {/* Hero Section */}
        <section className="bg-accent py-10">
          <div className="container">
            <motion.div 
              className="text-center max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to BeShop Congo</h1>
              <p className="text-lg mb-6">Your trusted online shopping destination in Congo</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link to="/products">Browse Products</Link>
                </Button>
                <WhatsAppContact 
                  phoneNumber="243978100940"
                  message="Hello! I'm interested in shopping with BeShop."
                  variant="outline"
                  size="lg"
                >
                  Contact Support
                </WhatsAppContact>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Featured Gallery Section */}
        <FeaturedGallery />

        {/* Categories Section */}
        <section className="py-8">
          <div className="container">
            <motion.h2 
              className="text-xl md:text-2xl font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Shop by Category
            </motion.h2>
            <ScrollArea className="w-full whitespace-nowrap">
              <motion.div 
                className="flex space-x-4 py-4"
                variants={containerAnimation}
                initial="hidden"
                animate="visible"
              >
                {mockCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    variants={itemAnimation}
                    custom={index}
                  >
                    <Link
                      to={`/categories`}
                      state={{ category: category.id }}
                      className="flex flex-col items-center space-y-2 min-w-[100px]"
                    >
                      <div className="bg-accent hover:bg-accent/70 transition-colors rounded-full h-20 w-20 flex items-center justify-center shadow-sm">
                        <div className="text-xl font-bold text-primary">{category.name.charAt(0)}</div>
                      </div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </section>

        {/* Products Tabs Section */}
        <section className="py-8">
          <div className="container">
            <Tabs defaultValue="featured" onValueChange={setActiveTab} value={activeTab}>
              <div className="flex items-center justify-between mb-4">
                <motion.h2 
                  className="text-xl md:text-2xl font-semibold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Our Products
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <TabsList>
                    <TabsTrigger value="featured">Featured</TabsTrigger>
                    <TabsTrigger value="popular">Most Popular</TabsTrigger>
                  </TabsList>
                </motion.div>
              </div>
              
              <TabsContent value="featured" className="space-y-4">
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  variants={containerAnimation}
                  initial="hidden"
                  animate="visible"
                >
                  {featuredProducts.map((product, index) => (
                    <motion.div key={product.id} variants={itemAnimation} custom={index}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
              
              <TabsContent value="popular" className="space-y-4">
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  variants={containerAnimation}
                  initial="hidden"
                  animate="visible"
                >
                  {popularProducts.slice(0, 8).map((product, index) => (
                    <motion.div key={product.id} variants={itemAnimation} custom={index}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
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
            <motion.div 
              className="flex flex-col md:flex-row items-center justify-between gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Need Help Shopping?</h2>
                <p className="text-gray-600 max-w-md">
                  Our customer support team is ready to assist you through WhatsApp.
                </p>
              </div>
              <WhatsAppContact
                phoneNumber="243978100940"
                message="Hello! I need assistance with shopping on BeShop."
                className="bg-whatsapp hover:bg-whatsapp-dark"
                size="lg"
              >
                Chat with Us on WhatsApp
              </WhatsAppContact>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-10">
          <div className="container">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemAnimation} className="bg-accent rounded-lg p-6 text-center">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Quality Products</h3>
                <p className="text-sm text-gray-600">
                  We ensure that all our products meet high quality standards.
                </p>
              </motion.div>
              
              <motion.div variants={itemAnimation} className="bg-accent rounded-lg p-6 text-center">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Fast Delivery</h3>
                <p className="text-sm text-gray-600">
                  Quick delivery service to get your products to you as soon as possible.
                </p>
              </motion.div>
              
              <motion.div variants={itemAnimation} className="bg-accent rounded-lg p-6 text-center">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600">
                  Our customer support team is always ready to assist you.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
