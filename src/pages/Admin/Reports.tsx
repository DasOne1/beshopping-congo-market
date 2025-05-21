
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Download } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminLayout from '@/components/Admin/AdminLayout';
import {
  ResponsiveContainer,
  AreaChart,
  BarChart,
  PieChart,
  Pie,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Cell,
} from "recharts";

export default function AdminReports() {
  const [reportPeriod, setReportPeriod] = useState("monthly");
  const [reportType, setReportType] = useState("sales");
  const [exportFormat, setExportFormat] = useState("pdf");
  
  // Sample data for reports
  const monthlySalesData = [
    { month: 'Jan', sales: 120000, orders: 24, customers: 18 },
    { month: 'Feb', sales: 145000, orders: 29, customers: 22 },
    { month: 'Mar', sales: 160000, orders: 32, customers: 26 },
    { month: 'Apr', sales: 180000, orders: 36, customers: 28 },
    { month: 'May', sales: 220000, orders: 44, customers: 35 },
    { month: 'Jun', sales: 270000, orders: 54, customers: 42 },
    { month: 'Jul', sales: 290000, orders: 58, customers: 45 },
  ];
  
  const categorySalesData = [
    { name: 'Clothing', sales: 480000, percentage: 40 },
    { name: 'Electronics', sales: 240000, percentage: 20 },
    { name: 'Beauty', sales: 180000, percentage: 15 },
    { name: 'Home', sales: 120000, percentage: 10 },
    { name: 'Accessories', sales: 180000, percentage: 15 },
  ];
  
  const COLORS = ['#FF9A5A', '#F97316', '#FFB74D', '#FFCC80', '#FFE0B2'];
  
  const topSellingProducts = [
    { id: 1, name: "Smartphone XYZ", sku: "PHXY001", category: "Electronics", sold: 48, revenue: 240000 },
    { id: 2, name: "Men's T-Shirt", sku: "CLMT002", category: "Clothing", sold: 72, revenue: 216000 },
    { id: 3, name: "Gold Necklace", sku: "ACGN003", category: "Accessories", sold: 26, revenue: 208000 },
    { id: 4, name: "Wireless Headphones", sku: "PHWH004", category: "Electronics", sold: 36, revenue: 180000 },
    { id: 5, name: "Women's Dress", sku: "CLWD005", category: "Clothing", sold: 52, revenue: 156000 },
  ];
  
  const formatCurrency = (value: number) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " CDF";
  };
  
  const handleExport = () => {
    toast.success(`Report exported as ${exportFormat.toUpperCase()}`);
  };
  
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground">Generate and analyze business reports</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales Report</SelectItem>
                <SelectItem value="products">Product Report</SelectItem>
                <SelectItem value="customers">Customer Report</SelectItem>
                <SelectItem value="inventory">Inventory Report</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger className="w-full sm:w-[100px]">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Sales Overview Card */}
            <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlySalesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip 
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="sales" 
                        name="Sales"
                        stroke="#FF9A5A" 
                        fill="#FF9A5A33" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-primary">1,385,000 CDF</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold">277</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Customers</p>
                  <p className="text-2xl font-bold">216</p>
                </div>
              </CardFooter>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Sales */}
              <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                  <CardDescription>Distribution across product categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categorySalesData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="sales"
                          nameKey="name"
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                        >
                          {categorySalesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Top Products */}
              <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>Best performing products</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={topSellingProducts.map(product => ({
                          name: product.name.length > 15 ? product.name.substring(0, 15) + "..." : product.name,
                          revenue: product.revenue
                        }))}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" />
                        <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                        <Bar dataKey="revenue" name="Revenue" fill="#F97316" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sales" className="space-y-4">
            <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Detailed Sales Report</CardTitle>
                <CardDescription>
                  {reportPeriod === 'monthly' ? 'Monthly' : reportPeriod === 'weekly' ? 'Weekly' : 'Daily'} sales breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Sales report for {reportPeriod} period</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Products Sold</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Avg. Order Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlySalesData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{data.month}</TableCell>
                        <TableCell>{data.orders}</TableCell>
                        <TableCell>{data.orders * 2}</TableCell>
                        <TableCell>{formatCurrency(data.sales)}</TableCell>
                        <TableCell>{formatCurrency(Math.round(data.sales / data.orders))}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Change Date Range
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Full Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4">
            <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Detailed product sales and inventory data</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Top performing products</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Units Sold</TableHead>
                      <TableHead>Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topSellingProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.sold}</TableCell>
                        <TableCell>{formatCurrency(product.revenue)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Product Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AdminLayout>
  );
}

function toast() {
  return {
    success: (message: string) => {
      console.log('Success:', message);
      // In a real app, we would show a toast notification here
    },
    error: (message: string) => {
      console.error('Error:', message);
      // In a real app, we would show a toast notification here
    }
  };
}
