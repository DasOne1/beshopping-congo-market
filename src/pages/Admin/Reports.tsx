
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Filter } from 'lucide-react';

const salesData = [
  { name: 'Jan', sales: 4000, profit: 2400 },
  { name: 'Feb', sales: 3000, profit: 1398 },
  { name: 'Mar', sales: 2000, profit: 9800 },
  { name: 'Apr', sales: 2780, profit: 3908 },
  { name: 'May', sales: 1890, profit: 4800 },
  { name: 'Jun', sales: 2390, profit: 3800 },
  { name: 'Jul', sales: 3490, profit: 4300 },
];

const Reports = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reportType, setReportType] = useState("sales");

  const handleGenerateReport = () => {
    toast({
      title: "Report Generated",
      description: "Your report is being prepared for download.",
    });
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Reports & Analysis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="font-medium mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">1,243</p>
          <p className="text-sm text-green-600">+12% from last month</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-2">Revenue</h3>
          <p className="text-3xl font-bold">$28,450</p>
          <p className="text-sm text-green-600">+8% from last month</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium mb-2">Customers</h3>
          <p className="text-3xl font-bold">832</p>
          <p className="text-sm text-green-600">+5% from last month</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="md:col-span-3">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Sales Overview</h3>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
                <Bar dataKey="profit" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
        <Card className="p-4">
          <h3 className="font-medium mb-2">Generate Report</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Report Type</label>
              <Select defaultValue="sales">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Report</SelectItem>
                  <SelectItem value="inventory">Inventory Report</SelectItem>
                  <SelectItem value="customers">Customer Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm mb-1">Date Range</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="border rounded-md p-3"
              />
            </div>
            <Button onClick={handleGenerateReport} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </Card>
      </div>
      
      <Separator className="my-6" />
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
        <div className="flex items-center justify-between mb-4">
          <Input placeholder="Search orders..." className="max-w-xs" />
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        
        <Card className="p-4">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Order ID</th>
                <th className="py-2 text-left">Customer</th>
                <th className="py-2 text-left">Date</th>
                <th className="py-2 text-right">Amount</th>
                <th className="py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">#ORD-001</td>
                <td className="py-2">John Doe</td>
                <td className="py-2">2023-06-15</td>
                <td className="py-2 text-right">$125.00</td>
                <td className="py-2 text-right">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2">#ORD-002</td>
                <td className="py-2">Jane Smith</td>
                <td className="py-2">2023-06-14</td>
                <td className="py-2 text-right">$85.50</td>
                <td className="py-2 text-right">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Processing</span>
                </td>
              </tr>
              <tr>
                <td className="py-2">#ORD-003</td>
                <td className="py-2">Robert Johnson</td>
                <td className="py-2">2023-06-14</td>
                <td className="py-2 text-right">$220.75</td>
                <td className="py-2 text-right">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
