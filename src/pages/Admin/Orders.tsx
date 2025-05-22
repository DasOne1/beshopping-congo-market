
import React from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag } from 'lucide-react';

export default function Orders() {
  // Mock orders data
  const orders = [
    {
      id: 'ORD-001',
      customer: 'Jean Mukendi',
      date: '2023-07-15',
      amount: 45000,
      status: 'delivered',
    },
    {
      id: 'ORD-002',
      customer: 'Marie Lutumba',
      date: '2023-07-14',
      amount: 32000,
      status: 'processing',
    },
    {
      id: 'ORD-003',
      customer: 'Joseph Mbaya',
      date: '2023-07-14',
      amount: 78000,
      status: 'pending',
    },
    {
      id: 'ORD-004',
      customer: 'Sylvie Katumba',
      date: '2023-07-13',
      amount: 24500,
      status: 'delivered',
    },
  ];
  
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <ShoppingBag className="mr-2 h-6 w-6" />
              Orders
            </h1>
            <p className="text-muted-foreground">Manage all customer orders</p>
          </div>
          
          <Button>New Order</Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Manage your customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg bg-background border"
                >
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
      </div>
    </AdminLayout>
  );
}
