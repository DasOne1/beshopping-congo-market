
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'With over 10 years of experience in retail, Sarah founded BeShop with a vision to transform e-commerce in Congo.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
      id: 2,
      name: 'Jean Pierre Lokonga',
      role: 'Operations Manager',
      bio: 'Jean oversees all aspects of our operations, ensuring smooth delivery and exceptional customer service.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
      id: 3,
      name: 'Marie Mutombo',
      role: 'Customer Relations',
      bio: 'Marie leads our customer support team, focusing on building strong relationships with our valued customers.',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
    },
    {
      id: 4,
      name: 'David Mbemba',
      role: 'Product Specialist',
      bio: 'David ensures that we source only the highest quality products for our customers across Congo.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80'
    }
  ];

  const achievements = [
    { number: '5,000+', label: 'Happy Customers' },
    { number: '99%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Customer Support' },
    { number: '1,200+', label: 'Products Available' }
  ];
  
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
        <section className="py-16 bg-accent/20">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-5xl font-bold mb-4">About BeShop Congo</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  We're building the future of e-commerce in Congo, one happy customer at a time.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild>
                    <Link to="/products">Explore Products</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1516733968668-dbdce39c4651?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="BeShop Store" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-sm font-medium">Our mission is to provide quality products with exceptional service</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full" />
              <p className="text-lg">
                Founded in 2022, BeShop Congo was born from a simple idea: make online shopping accessible, 
                convenient and trustworthy for everyone in the Democratic Republic of Congo. 
                What started as a small operation has grown into Congo's most trusted online marketplace.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3 className="text-2xl font-semibold">Our Vision</h3>
                <p>
                  To be the leading e-commerce platform in Congo, revolutionizing how people shop by providing 
                  easy access to quality products and exceptional customer service.
                </p>
                
                <h3 className="text-2xl font-semibold pt-4">Our Mission</h3>
                <p>
                  We strive to make online shopping accessible to all Congolese by offering:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>High-quality, authentic products at competitive prices</li>
                  <li>Exceptional, personalized customer service via WhatsApp</li>
                  <li>A user-friendly shopping experience optimized for mobile devices</li>
                  <li>Reliable delivery options throughout Congo</li>
                </ul>
              </motion.div>
              
              <motion.div
                className="grid grid-cols-2 gap-4"
                variants={containerAnimation}
                initial="hidden"
                animate="visible"
              >
                {achievements.map((item, index) => (
                  <motion.div 
                    key={index} 
                    variants={itemAnimation}
                  >
                    <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm h-full">
                      <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                        <div className="text-3xl font-bold text-primary mb-2">{item.number}</div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full" />
              <p className="text-lg">
                At BeShop Congo, we're guided by a set of core values that define who we are and how we operate.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>
                        <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
                        <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Quality</h3>
                    <p className="text-muted-foreground flex-1">
                      We only offer products that meet our strict quality standards. Every item is carefully selected to ensure customer satisfaction.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M8.8 19a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"/>
                        <path d="M3 14v-3a7 7 0 0 1 11.5-5.4"/>
                        <path d="M21 12v3a7 7 0 0 1-11.5 5.4"/>
                        <path d="m21 9-5-5"/>
                        <path d="m16 4 5 5"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Trust</h3>
                    <p className="text-muted-foreground flex-1">
                      We build trust through transparency, authentic products, and reliable service. Your confidence in us is our most valuable asset.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="m8 14 6-6"/>
                        <path d="M13.5 8.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
                        <path d="M10.5 15.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
                        <circle cx="12" cy="12" r="10"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
                    <p className="text-muted-foreground flex-1">
                      We make online shopping accessible to all Congolese by optimizing for mobile, offering WhatsApp support, and ensuring a seamless experience.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <div className="w-16 h-1 bg-primary mx-auto mb-6 rounded-full" />
              <p className="text-lg">
                The dedicated professionals behind BeShop Congo are committed to providing you with the best online shopping experience.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
            >
              {teamMembers.map((member) => (
                <motion.div key={member.id} variants={itemAnimation}>
                  <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
                    <div className="aspect-square relative overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-sm text-primary mb-2">{member.role}</p>
                      <p className="text-sm text-muted-foreground">{member.bio}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 bg-primary text-primary-foreground">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Shop with BeShop?</h2>
              <p className="text-lg mb-8 opacity-90">
                Join thousands of satisfied customers who trust BeShop Congo for their shopping needs.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  asChild 
                  variant="secondary" 
                  size="lg"
                >
                  <Link to="/products">Browse Products</Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                >
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
