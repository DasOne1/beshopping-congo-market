
import React from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Customers() {
  // Mock customers data
  const customers = [
    {
      id: 1,
      name: 'Marie Lutumba',
      email: 'marie@example.com',
      spent: 78000,
      orders: 3,
    },
    {
      id: 2,
      name: 'Jean Mukendi',
      email: 'jean@example.com',
      spent: 45000,
      orders: 2,
    },
    {
      id: 3,
      name: 'Joseph Mbaya',
      email: 'joseph@example.com',
      spent: 120000,
      orders: 5,
    },
    {
      id: 4,
      name: 'Sylvie Katumba',
      email: 'sylvie@example.com',
      spent: 24500,
      orders: 1,
    },
  ];
  
  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Users className="mr-2 h-6 w-6" />
              Customers
            </h1>
            <p className="text-muted-foreground">Manage your customer profiles</p>
          </div>
          
          <Button>Add Customer</Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
            <CardDescription>View and manage customer information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {customers.map((customer) => (
                <div key={customer.id} className="flex items-center gap-3 p-3 rounded-lg bg-background border">
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
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
