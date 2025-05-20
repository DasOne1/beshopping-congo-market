
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Settings, ShoppingBag, Heart, LogOut, Mail, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

export default function Account() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock order history
  const orderHistory = [
    { 
      id: "ORD-001", 
      date: "2023-05-15", 
      amount: 45000, 
      status: "Delivered",
      items: 3
    },
    { 
      id: "ORD-002", 
      date: "2023-06-22", 
      amount: 78000, 
      status: "Processing",
      items: 5 
    },
    { 
      id: "ORD-003", 
      date: "2023-07-03", 
      amount: 32500, 
      status: "Delivered",
      items: 2
    },
  ];
  
  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "Alex Mutombo",
      email: "alex@example.com",
      phone: "243978123456",
      address: "123 Main Street, Kinshasa",
    },
  });
  
  // Password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: true,
    orderUpdates: true,
    promotions: false,
    newsletter: true,
  });
  
  const handleProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    setIsLoading(true);
    
    // In a real app, you would submit to your API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    console.log(values);
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
    
    setIsLoading(false);
  };
  
  const handlePasswordSubmit = async (values: z.infer<typeof passwordFormSchema>) => {
    setIsLoading(true);
    
    // In a real app, you would submit to your API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    console.log(values);
    
    toast({
      title: "Password updated",
      description: "Your password has been changed successfully.",
    });
    
    passwordForm.reset();
    setIsLoading(false);
  };
  
  const handleToggleSetting = (setting: string, value: boolean) => {
    setSettings({
      ...settings,
      [setting]: value,
    });
    
    toast({
      title: "Setting updated",
      description: `${setting.charAt(0).toUpperCase() + setting.slice(1)} ${value ? 'enabled' : 'disabled'}.`,
    });
  };
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row gap-6"
          >
            {/* Sidebar */}
            <div className="w-full md:w-64 lg:w-72">
              <Card className="sticky top-24 overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3" alt="User" />
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">Alex Mutombo</CardTitle>
                      <CardDescription>Customer since 2023</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-2">
                  <TabsList className="grid grid-cols-1 md:grid-cols-1 w-full h-auto mt-2" orientation="vertical">
                    <div className="flex flex-col gap-2">
                      <TabsTrigger
                        value="profile"
                        className={`flex w-full justify-start px-3 py-2 ${
                          activeTab === "profile" ? "bg-accent" : ""
                        }`}
                        onClick={() => setActiveTab("profile")}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </TabsTrigger>
                      <TabsTrigger
                        value="orders"
                        className={`flex w-full justify-start px-3 py-2 ${
                          activeTab === "orders" ? "bg-accent" : ""
                        }`}
                        onClick={() => setActiveTab("orders")}
                      >
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Orders
                      </TabsTrigger>
                      <TabsTrigger
                        value="favorites"
                        className={`flex w-full justify-start px-3 py-2 ${
                          activeTab === "favorites" ? "bg-accent" : ""
                        }`}
                        onClick={() => setActiveTab("favorites")}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Favorites
                      </TabsTrigger>
                      <TabsTrigger
                        value="security"
                        className={`flex w-full justify-start px-3 py-2 ${
                          activeTab === "security" ? "bg-accent" : ""
                        }`}
                        onClick={() => setActiveTab("security")}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Security
                      </TabsTrigger>
                      <TabsTrigger
                        value="settings"
                        className={`flex w-full justify-start px-3 py-2 ${
                          activeTab === "settings" ? "bg-accent" : ""
                        }`}
                        onClick={() => setActiveTab("settings")}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </TabsTrigger>
                    </div>
                  </TabsList>
                  
                  <Button
                    variant="outline"
                    className="w-full mt-6 border-destructive/50 text-destructive hover:border-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <Tabs value={activeTab} onValueChange={setActiveTab} orientation="horizontal">
                {/* Profile Tab */}
                <TabsContent value="profile">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>
                          Update your personal information and contact details
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <Form {...profileForm}>
                          <form 
                            onSubmit={profileForm.handleSubmit(handleProfileSubmit)}
                            className="space-y-4"
                          >
                            <div className="flex flex-col md:flex-row gap-4">
                              <FormField
                                control={profileForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="flex flex-col md:flex-row gap-4">
                              <FormField
                                control={profileForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                      <Input type="email" placeholder="Your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={profileForm.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Your phone number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={profileForm.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your address" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="pt-4">
                              <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update Profile"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
                
                {/* Orders Tab */}
                <TabsContent value="orders">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Order History</CardTitle>
                        <CardDescription>
                          View and track all your previous orders
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        {orderHistory.length > 0 ? (
                          <div className="space-y-4">
                            {orderHistory.map((order) => (
                              <Card key={order.id} className="bg-background">
                                <CardContent className="p-4">
                                  <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                      <div className="font-medium text-lg">{order.id}</div>
                                      <div className="text-sm text-muted-foreground">
                                        Ordered on {new Date(order.date).toLocaleDateString()}
                                      </div>
                                      <div className="text-sm mt-1">
                                        {order.items} {order.items === 1 ? 'item' : 'items'}
                                      </div>
                                    </div>
                                    
                                    <div className="text-right">
                                      <div className="font-medium">
                                        {order.amount.toLocaleString()} CDF
                                      </div>
                                      <div className={`inline-block px-2 py-1 mt-1 text-xs rounded-full ${
                                        order.status === 'Delivered' 
                                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                      }`}>
                                        {order.status}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex justify-end mt-4">
                                    <Button variant="outline" size="sm">
                                      View Details
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-medium">No orders yet</h3>
                            <p className="mt-1 text-muted-foreground">
                              When you place an order, it will appear here.
                            </p>
                            <Button className="mt-4" asChild>
                              <a href="/products">Start Shopping</a>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
                
                {/* Favorites Tab */}
                <TabsContent value="favorites">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Your Favorites</CardTitle>
                        <CardDescription>
                          Products you've saved for later
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="text-center py-12">
                          <Heart className="w-12 h-12 mx-auto text-muted-foreground" />
                          <h3 className="mt-4 text-lg font-medium">Your favorites will appear here</h3>
                          <p className="mt-1 text-muted-foreground">
                            Save products by clicking the heart icon on product pages.
                          </p>
                          <Button className="mt-4" asChild>
                            <a href="/products">Browse Products</a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
                
                {/* Security Tab */}
                <TabsContent value="security">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Security Settings</CardTitle>
                        <CardDescription>
                          Update your password and security preferences
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent>
                        <Form {...passwordForm}>
                          <form 
                            onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                            className="space-y-4"
                          >
                            <FormField
                              control={passwordForm.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex flex-col md:flex-row gap-4">
                              <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                      <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={passwordForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                      <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="pt-4">
                              <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Change Password"}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
                
                {/* Settings Tab */}
                <TabsContent value="settings">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle>Preferences</CardTitle>
                        <CardDescription>
                          Manage your application preferences and settings
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        {/* Notification Settings */}
                        <div>
                          <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <div className="font-medium">Push Notifications</div>
                                <div className="text-sm text-muted-foreground">
                                  Receive notifications about your account
                                </div>
                              </div>
                              <Switch
                                checked={settings.notifications}
                                onCheckedChange={(checked) => handleToggleSetting('notifications', checked)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <div className="font-medium">Order Updates</div>
                                <div className="text-sm text-muted-foreground">
                                  Receive updates about your orders
                                </div>
                              </div>
                              <Switch
                                checked={settings.orderUpdates}
                                onCheckedChange={(checked) => handleToggleSetting('orderUpdates', checked)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <div className="font-medium">Promotional Emails</div>
                                <div className="text-sm text-muted-foreground">
                                  Receive emails about new products and sales
                                </div>
                              </div>
                              <Switch
                                checked={settings.promotions}
                                onCheckedChange={(checked) => handleToggleSetting('promotions', checked)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <div className="font-medium">Newsletter</div>
                                <div className="text-sm text-muted-foreground">
                                  Receive our weekly newsletter
                                </div>
                              </div>
                              <Switch
                                checked={settings.newsletter}
                                onCheckedChange={(checked) => handleToggleSetting('newsletter', checked)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Theme */}
                        <div>
                          <h3 className="text-lg font-medium mb-4">Theme Settings</h3>
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <div className="font-medium">Theme Mode</div>
                              <div className="text-sm text-muted-foreground">
                                Toggle between light and dark mode
                              </div>
                            </div>
                            <ThemeToggle />
                          </div>
                        </div>
                        
                        {/* Contact Methods */}
                        <div>
                          <h3 className="text-lg font-medium mb-4">Contact Methods</h3>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-background">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <Phone className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">WhatsApp Support</p>
                                <p className="text-sm text-muted-foreground">
                                  Contact our support team on WhatsApp for immediate assistance
                                </p>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <a href="https://wa.me/243978100940">Contact</a>
                              </Button>
                            </div>
                            
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-background">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <Mail className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">Email Support</p>
                                <p className="text-sm text-muted-foreground">
                                  Send us an email for non-urgent inquiries
                                </p>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <a href="mailto:support@beshop.com">Email</a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
