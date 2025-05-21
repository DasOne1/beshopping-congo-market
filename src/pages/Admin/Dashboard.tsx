
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Calendar, 
  MessageSquare
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { mockProducts } from '@/data/mockData';
import AdminLayout from '@/components/Admin/AdminLayout';
import {
  ResponsiveContainer,
  AreaChart,
  BarChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("7d");
  
  // Mock data for charts
  const salesData = [
    { name: "Jan", total: 1200 },
    { name: "Feb", total: 1800 },
    { name: "Mar", total: 2200 },
    { name: "Apr", total: 2800 },
    { name: "May", total: 3500 },
    { name: "Jun", total: 3200 },
    { name: "Jul", total: 4100 },
  ];
  
  const topProducts = [...mockProducts]
    .sort((a, b) => b.popular - a.popular)
    .slice(0, 5);
    
  const recentOrders = [
    {
      id: "ORD-001",
      customer: "Jean Mukendi",
      date: "2023-07-15",
      amount: 45000,
      status: "delivered",
    },
    {
      id: "ORD-002",
      customer: "Marie Lutumba",
      date: "2023-07-14",
      amount: 32000,
      status: "processing",
    },
    {
      id: "ORD-003",
      customer: "Joseph Mbaya",
      date: "2023-07-14",
      amount: 78000,
      status: "pending",
    },
    {
      id: "ORD-004",
      customer: "Sylvie Katumba",
      date: "2023-07-13",
      amount: 24500,
      status: "delivered",
    },
  ];
  
  const recentCustomers = [
    {
      id: 1,
      name: "Marie Lutumba",
      email: "marie@example.com",
      spent: 78000,
      orders: 3,
    },
    {
      id: 2,
      name: "Jean Mukendi",
      email: "jean@example.com",
      spent: 45000,
      orders: 2,
    },
    {
      id: 3,
      name: "Joseph Mbaya",
      email: "joseph@example.com",
      spent: 120000,
      orders: 5,
    },
  ];
  
  const recentMessages = [
    {
      id: 1,
      name: "Marie Lutumba",
      message: "When will my order be delivered?",
      time: "10:30 AM",
      unread: true,
    },
    {
      id: 2,
      name: "Jean Mukendi",
      message: "Do you have this product in red color?",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 3,
      name: "Joseph Mbaya",
      message: "I want to order in bulk. Do you offer discounts?",
      time: "Yesterday",
      unread: true,
    },
  ];
  
  const stats = [
    {
      title: "Total Revenue",
      value: "1.2M CDF",
      description: "+20.1% from last month",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "New Customers",
      value: "32",
      description: "+12% from last month",
      icon: Users,
      trend: "up",
    },
    {
      title: "Total Orders",
      value: "54",
      description: "+8% from last month",
      icon: ShoppingBag,
      trend: "up",
    },
    {
      title: "Products Sold",
      value: "123",
      description: "+15% from last month",
      icon: Package,
      trend: "up",
    },
  ];

  // Prepare data for product chart
  const productChartData = topProducts.map(product => ({
    name: product.name.length > 15 ? product.name.substring(0, 15) + "..." : product.name,
    sales: product.popular * 10
  }));

  return (
    <AdminLayout>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Tabs defaultValue="7d" onValueChange={setTimeRange} value={timeRange}>
            <TabsList>
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
              <TabsTrigger value="90d">90d</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-full ${
                  stat.trend === "up" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                    : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                }`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${
                  stat.trend === "up" 
                    ? "text-green-600 dark:text-green-400" 
                    : "text-red-600 dark:text-red-400"
                }`}>
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>
        
        {/* Charts Section */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          {/* Sales Chart */}
          <Card className="lg:col-span-4 overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Daily revenue for the past month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="rgb(var(--primary))" 
                      fill="rgba(var(--primary), 0.2)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Top Products */}
          <Card className="lg:col-span-3 overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Your best selling products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={productChartData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="sales" fill="rgb(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Orders & Recent Customers */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          {/* Recent Orders */}
          <Card className="lg:col-span-4 overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg bg-background">
                    <div>
                      <div className="font-medium">{order.customer}</div>
                      <div className="text-sm text-muted-foreground">{order.id} • {new Date(order.date).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-3 mt-2 sm:mt-0">
                      <div className="text-sm font-medium">{order.amount.toLocaleString()} CDF</div>
                      <Badge variant={
                        order.status === "delivered" 
                          ? "default" 
                          : order.status === "processing" 
                          ? "secondary" 
                          : "outline"
                      }>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Customers */}
          <Card className="lg:col-span-3 overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Customers</CardTitle>
                <CardDescription>New customer registrations</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center gap-3 p-3 rounded-lg bg-background">
                    <Avatar>
                      <AvatarFallback>
                        {customer.name.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground truncate">{customer.email}</div>
                    </div>
                    <div className="text-sm text-right">
                      <div className="font-medium">{customer.spent.toLocaleString()} CDF</div>
                      <div className="text-muted-foreground">{customer.orders} orders</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Messages & Calendar */}
        <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
          {/* Recent Messages */}
          <Card className="lg:col-span-4 overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Latest WhatsApp inquiries</CardDescription>
              </div>
              <Button variant="outline" size="sm">Open WhatsApp</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex items-start gap-3 p-3 rounded-lg bg-background">
                    <Avatar>
                      <AvatarFallback>
                        {message.name.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <div className="font-medium flex items-center">
                          {message.name}
                          {message.unread && (
                            <span className="ml-2 w-2 h-2 bg-primary rounded-full"></span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">{message.time}</div>
                      </div>
                      <div className="text-sm text-muted-foreground truncate mt-1">
                        {message.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <MessageSquare className="mr-2 h-4 w-4" />
                View All Messages
              </Button>
            </CardContent>
          </Card>
          
          {/* Upcoming Tasks */}
          <Card className="lg:col-span-3 overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle>Upcoming Tasks</CardTitle>
                <CardDescription>Your schedule for today</CardDescription>
              </div>
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-background">
                  <div className="flex justify-between items-center">
                    <Badge>10:00 AM</Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <TrendingUp className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="font-medium mt-2">Weekly Sales Meeting</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Review sales performance with the team
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-background">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">2:00 PM</Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Package className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="font-medium mt-2">Inventory Check</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Verify new stock arrival and update system
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-background">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">4:30 PM</Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="font-medium mt-2">Customer Follow-ups</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Send follow-up messages to recent customers
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Calendar className="mr-2 h-4 w-4" />
                View Full Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
