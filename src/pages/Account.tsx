
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, ShoppingBag, Heart, LogOut, Lock, Mail, Phone } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { mockProducts } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';
import { toast } from 'sonner';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+243 123 456 789',
    address: '123 Main St, Kinshasa',
    avatarUrl: null, // Replace with actual avatar URL if available
  };

  // Mock order history
  const orderHistory = [
    {
      id: 'ORD-001',
      date: '2023-07-15',
      items: 3,
      total: 75000,
      status: 'Delivered',
    },
    {
      id: 'ORD-002',
      date: '2023-06-20',
      items: 2,
      total: 45000,
      status: 'Delivered',
    },
    {
      id: 'ORD-003',
      date: '2023-05-05',
      items: 1,
      total: 25000,
      status: 'Cancelled',
    },
  ];

  // Mock recently viewed products
  const recentlyViewed = mockProducts.slice(0, 4);

  // Handle form submissions
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Password changed successfully');
  };
  
  const handleAddressUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Address updated successfully');
  };

  const handleLogout = () => {
    toast.info('Logged out successfully');
    // Implement actual logout logic here
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="w-full md:w-1/3">
                <Card className="glass-effect">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-center">My Account</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={user.avatarUrl || ''} alt={user.name} />
                      <AvatarFallback className="text-2xl bg-primary text-white">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-semibold">{user.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{user.phone}</p>
                    
                    <Separator className="my-4" />
                    
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
                        <TabsTrigger value="profile" className="flex items-center justify-start">
                          <User className="h-4 w-4 mr-2" />
                          <span>Profile</span>
                        </TabsTrigger>
                        <TabsTrigger value="orders" className="flex items-center justify-start">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          <span>Orders</span>
                        </TabsTrigger>
                        <TabsTrigger value="favorites" className="flex items-center justify-start">
                          <Heart className="h-4 w-4 mr-2" />
                          <span>Favorites</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center justify-start">
                          <Settings className="h-4 w-4 mr-2" />
                          <span>Settings</span>
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    
                    <Button 
                      variant="ghost" 
                      className="mt-6 text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </Button>
                  </CardContent>
                </Card>
              </div>
              
              <div className="w-full md:w-2/3">
                <TabsContent value="profile" className="mt-0">
                  <Card className="glass-effect">
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>Update your personal details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={user.name} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={user.email} />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" defaultValue={user.phone} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="avatar">Profile Picture</Label>
                            <Input id="avatar" type="file" />
                          </div>
                        </div>
                        
                        <Button type="submit">Save Changes</Button>
                      </form>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Address Information</h3>
                        <form onSubmit={handleAddressUpdate} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" defaultValue={user.address} />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input id="city" defaultValue="Kinshasa" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="province">Province</Label>
                              <Input id="province" defaultValue="Kinshasa" />
                            </div>
                          </div>
                          
                          <Button type="submit">Update Address</Button>
                        </form>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Security</h3>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input id="currentPassword" type="password" />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input id="newPassword" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm Password</Label>
                              <Input id="confirmPassword" type="password" />
                            </div>
                          </div>
                          
                          <Button type="submit">Change Password</Button>
                        </form>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="orders" className="mt-0">
                  <Card className="glass-effect">
                    <CardHeader>
                      <CardTitle>Order History</CardTitle>
                      <CardDescription>Track and manage your orders</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {orderHistory.length > 0 ? (
                        <div className="space-y-4">
                          {orderHistory.map((order) => (
                            <Card key={order.id}>
                              <CardHeader className="py-3">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <CardTitle className="text-sm font-medium">{order.id}</CardTitle>
                                    <CardDescription>{new Date(order.date).toLocaleDateString()}</CardDescription>
                                  </div>
                                  <div className="text-right">
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                                      order.status === 'Delivered' 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                    }`}>
                                      {order.status}
                                    </span>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="py-2">
                                <div className="flex justify-between items-center">
                                  <p className="text-sm">{order.items} item{order.items !== 1 ? 's' : ''}</p>
                                  <p className="font-medium">{order.total.toLocaleString()} FC</p>
                                </div>
                              </CardContent>
                              <CardFooter className="pt-0 pb-3 flex justify-end">
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600" />
                          <h3 className="mt-2 text-lg font-medium">No orders yet</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">When you place orders, they will appear here</p>
                          <Button className="mt-4" asChild>
                            <a href="/products">Start Shopping</a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="favorites" className="mt-0">
                  <Card className="glass-effect">
                    <CardHeader>
                      <CardTitle>Favorites</CardTitle>
                      <CardDescription>Products you've saved</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recentlyViewed.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-0">
                  <Card className="glass-effect">
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Theme Preferences</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-orange-100'}`}>
                              {darkMode ? (
                                <Moon className="h-5 w-5 text-white" />
                              ) : (
                                <Sun className="h-5 w-5 text-orange-600" />
                              )}
                            </div>
                            <div>
                              <Label>Dark Mode</Label>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                              </p>
                            </div>
                          </div>
                          <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Notification Preferences</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Push Notifications</Label>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Receive notifications for orders and promotions
                            </p>
                          </div>
                          <Switch checked={notifications} onCheckedChange={setNotifications} />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Communication Preferences</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span className="text-sm">Email: {user.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span className="text-sm">Phone: {user.phone}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" className="mt-2">
                            <Mail className="h-4 w-4 mr-2" />
                            Update Email
                          </Button>
                          <Button variant="outline" size="sm" className="mt-2">
                            <Phone className="h-4 w-4 mr-2" />
                            Update Phone
                          </Button>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium text-red-600 dark:text-red-400">Danger Zone</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          Permanently delete your account and all data
                        </p>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Recently Viewed Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {recentlyViewed.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Helper components
const Moon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

const Sun = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

export default AccountPage;
