
import { useState, useEffect } from 'react';
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
import { ChevronRight } from 'lucide-react';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("featured");
  const [categorizedProducts, setCategorizedProducts] = useState<{[key: string]: typeof mockProducts}>({});
  
  // Get featured products
  const featuredProducts = mockProducts.filter(product => product.featured);
  
  // Get most popular products
  const popularProducts = [...mockProducts].sort((a, b) => b.popular - a.popular).slice(0, 8);

  // Group products by category
  useEffect(() => {
    const groupedProducts = mockCategories.reduce((acc, category) => {
      const productsInCategory = mockProducts.filter(product => 
        product.categoryId === category.id
      ).slice(0, 4); // Take only 4 products per category for display
      
      if (productsInCategory.length > 0) {
        acc[category.id] = productsInCategory;
      }
      return acc;
    }, {} as {[key: string]: typeof mockProducts});
    
    setCategorizedProducts(groupedProducts);
  }, []);

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

  const backgroundVariants = {
    animate: {
      backgroundPosition: ['0% 0%', '100% 100%'],
      transition: {
        duration: 15,
        ease: "linear",
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Animated Background */}
        <motion.section 
          className="py-12 relative overflow-hidden"
          variants={backgroundVariants}
          animate="animate"
          style={{
            backgroundImage: 'linear-gradient(45deg, rgba(255, 154, 90, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 115, 22, 0.2) 100%)',
            backgroundSize: '400% 400%'
          }}
        >
          <div className="container relative z-10">
            <motion.div 
              className="text-center max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1 
                className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.7 }}
              >
                Welcome to BeShop Congo
              </motion.h1>
              <motion.p 
                className="text-lg mb-8 text-foreground/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
              >
                Your trusted online shopping destination in Congo with quality products and fast delivery
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 shadow-lg">
                  <Link to="/products">Browse Products</Link>
                </Button>
                <WhatsAppContact 
                  phoneNumber="243978100940"
                  message="Hello! I'm interested in shopping with BeShop."
                  variant="outline"
                  size="lg"
                  className="shadow-lg hover:shadow-xl transition-shadow"
                >
                  Contact Support
                </WhatsAppContact>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Animated circles in background */}
          <motion.div 
            className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-r from-orange-500/20 to-orange-300/20 blur-3xl"
            animate={{ 
              x: [0, 30, 0], 
              y: [0, 20, 0],
              scale: [1, 1.1, 1] 
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          <motion.div 
            className="absolute top-40 right-10 w-72 h-72 rounded-full bg-gradient-to-l from-primary/20 to-orange-200/20 blur-3xl"
            animate={{ 
              x: [0, -20, 0], 
              y: [0, 30, 0],
              scale: [1, 1.2, 1] 
            }}
            transition={{ 
              duration: 10, 
              delay: 1,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
        </motion.section>
        
        {/* Featured Gallery Section */}
        <FeaturedGallery />

        {/* Categories Section */}
        <section className="py-8 px-4">
          <div className="container">
            <motion.div 
              className="flex justify-between items-center mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-xl md:text-2xl font-semibold pl-1 border-l-4 border-primary">
                Shop by Category
              </h2>
              <Link to="/categories" className="text-sm font-medium text-primary flex items-center hover:underline">
                See All <ChevronRight size={16} />
              </Link>
            </motion.div>
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
                      <div className="glass-effect hover:bg-accent/70 transition-colors rounded-full h-20 w-20 flex items-center justify-center shadow-sm">
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
        <section className="py-8 px-4">
          <div className="container">
            <Tabs defaultValue="featured" onValueChange={setActiveTab} value={activeTab}>
              <div className="flex items-center justify-between mb-4">
                <motion.h2 
                  className="text-xl md:text-2xl font-semibold pl-1 border-l-4 border-primary"
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
                  {popularProducts.map((product, index) => (
                    <motion.div key={product.id} variants={itemAnimation} custom={index}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
              
              <div className="mt-6 text-center">
                <Button asChild variant="outline" className="hover:bg-primary/10">
                  <Link to="/products">View All Products</Link>
                </Button>
              </div>
            </Tabs>
          </div>
        </section>

        {/* Products By Category Section */}
        <section className="py-8 px-4">
          <div className="container">
            <motion.h2 
              className="text-xl md:text-2xl font-semibold mb-6 pl-1 border-l-4 border-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Browse By Category
            </motion.h2>
            
            {Object.entries(categorizedProducts).map(([categoryId, products], index) => {
              const category = mockCategories.find(cat => cat.id === categoryId);
              if (!category || products.length === 0) return null;
              
              return (
                <motion.div 
                  key={categoryId}
                  className="mb-10" 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-foreground/90">{category.name}</h3>
                    <Link to={`/categories`} state={{ category: categoryId }} className="text-sm font-medium text-primary flex items-center hover:underline">
                      View All <ChevronRight size={16} />
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* WhatsApp Support Banner */}
        <section className="bg-gradient-to-r from-whatsapp/10 to-whatsapp/20 py-8">
          <div className="container px-4">
            <motion.div 
              className="flex flex-col md:flex-row items-center justify-between gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-semibold mb-2">Need Help Shopping?</h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-md">
                  Our customer support team is ready to assist you through WhatsApp.
                </p>
              </div>
              <div className="flex gap-3">
                <WhatsAppContact
                  phoneNumber="243978100940"
                  message="Hello! I need assistance with shopping on BeShop."
                  className="bg-whatsapp hover:bg-whatsapp-dark shadow-lg"
                  size="lg"
                >
                  Chat Support
                </WhatsAppContact>
                <WhatsAppContact
                  phoneNumber="243974984449"
                  message="Hello! I need assistance with shopping on BeShop."
                  variant="outline"
                  className="border-whatsapp hover:bg-whatsapp/10 text-whatsapp dark:text-whatsapp shadow-lg"
                  size="lg"
                >
                  Sales Support
                </WhatsAppContact>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-10">
          <div className="container px-4">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemAnimation} className="glass-effect rounded-lg p-6 text-center">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Quality Products</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  We ensure that all our products meet high quality standards.
                </p>
              </motion.div>
              
              <motion.div variants={itemAnimation} className="glass-effect rounded-lg p-6 text-center">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">Fast Delivery</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Quick delivery service to get your products to you as soon as possible.
                </p>
              </motion.div>
              
              <motion.div variants={itemAnimation} className="glass-effect rounded-lg p-6 text-center">
                <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
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
