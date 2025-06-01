
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppContact from '@/components/WhatsAppContact';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  name: z.string().min(2, 'Le nom est requis'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().min(9, 'Le numéro de téléphone est requis'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // In a real app, you would send this to your backend
    console.log('Form data:', data);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message envoyé !",
      description: "Nous reviendrons vers vous dès que possible.",
    });
    
    form.reset();
    setIsSubmitting(false);
  };

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
      
      <main className="flex-1 pt-20">
        <section className="py-10 bg-accent/30">
          <div className="container">
            <motion.h1 
              className="text-3xl md:text-4xl font-bold mb-4 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Contactez-nous
            </motion.h1>
            <motion.p 
              className="text-center max-w-xl mx-auto text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Des questions sur nos produits ou services ? Nous sommes là pour vous aider !
            </motion.p>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <motion.div
                variants={containerAnimation}
                initial="hidden"
                animate="visible"
              >
                <motion.h2 
                  className="text-2xl font-semibold mb-6" 
                  variants={itemAnimation}
                >
                  Prenez contact avec nous
                </motion.h2>
                
                <div className="space-y-6">
                  <motion.div variants={itemAnimation}>
                    <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-4 flex gap-4">
                        <div className="flex items-center justify-center bg-primary/10 rounded-full p-3 h-12 w-12 flex-shrink-0">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Adresse</h3>
                          <p className="text-sm text-muted-foreground">
                            123 Commerce Street, Kinshasa, Democratic Republic of Congo
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={itemAnimation}>
                    <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-4 flex gap-4">
                        <div className="flex items-center justify-center bg-primary/10 rounded-full p-3 h-12 w-12 flex-shrink-0">
                          <Phone className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Téléphone</h3>
                          <p className="text-sm text-muted-foreground">
                            +243 978 100 940<br />
                            +243 974 984 449
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={itemAnimation}>
                    <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-4 flex gap-4">
                        <div className="flex items-center justify-center bg-primary/10 rounded-full p-3 h-12 w-12 flex-shrink-0">
                          <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Email</h3>
                          <p className="text-sm text-muted-foreground">
                            info@beshop.com<br />
                            support@beshop.com
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={itemAnimation} className="mt-8">
                    <h3 className="font-medium mb-4">Contactez-nous via WhatsApp</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <WhatsAppContact 
                        message="Bonjour ! Je souhaite me renseigner sur vos produits."
                        className="w-full sm:w-auto bg-whatsapp hover:bg-whatsapp-dark"
                      >
                        Contact principal
                      </WhatsAppContact>
                      
                      <WhatsAppContact 
                        useAlternate={true}
                        message="Bonjour ! Je souhaite parler à votre équipe de support."
                        variant="outline"
                        className="w-full sm:w-auto border-whatsapp text-whatsapp hover:bg-whatsapp/10"
                      >
                        Contact alternatif
                      </WhatsAppContact>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-6">Envoyer un message</h2>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom</FormLabel>
                              <FormControl>
                                <Input placeholder="votre nom" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your.email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Téléphone</FormLabel>
                              <FormControl>
                                <Input placeholder="Votre numéro de téléphone" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Comment pouvons-nous vous aider ?" 
                                  className="min-h-32"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>Sending...</>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" /> 
                              Envoyer le messagee
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Map */}
        <section className="py-8">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-lg overflow-hidden h-[300px] border border-border"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63552.44323244524!2d15.255417974988042!3d-4.325023635448577!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a3130fe066a8b%3A0x168b7e4e1f52378d!2sKinshasa%2C%20Democratic%20Republic%20of%20the%20Congo!5e0!3m2!1sen!2sus!4v1716351622118!5m2!1sen!2sus"
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="BeShopping Congo Location"
              />
            </motion.div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
