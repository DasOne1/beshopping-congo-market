import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

const Reports = () => {
  const [salesData, setSalesData] = useState([
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 2000 },
    { month: 'Apr', sales: 2780 },
    { month: 'May', sales: 1890 },
    { month: 'Jun', sales: 2390 },
    { month: 'Jul', sales: 3490 },
  ]);

  const handleExport = (format: string) => {
    // Simulate exporting data
    console.log(`Exporting data in ${format} format`);

    // Show a toast notification
    const toast = useToast();
    toast().success('Report exported successfully');
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Sales Reports</h1>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Monthly Sales</CardTitle>
          <CardDescription>Overview of sales performance by month</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart width={730} height={250} data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#FF9A5A" />
          </BarChart>
        </CardContent>
      </Card>

      <div className="mt-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => handleExport('CSV')}
        >
          Export as CSV
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleExport('Excel')}
        >
          Export as Excel
        </button>
      </div>
    </div>
  );
};

export default Reports;
