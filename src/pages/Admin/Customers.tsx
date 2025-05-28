
import React, { useState } from 'react';
import AdminLayout from '@/components/Admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Plus, Eye, Edit, Trash2, UserX, UserCheck } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCustomers, Customer } from '@/hooks/useCustomers';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Customers() {
  const { isAuthenticated } = useAuth();
  const { customers, isLoading, createCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
  });

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </AdminLayout>
    );
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p>Chargement des clients...</p>
        </div>
      </AdminLayout>
    );
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CD', {
      style: 'currency',
      currency: 'CDF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleCreateCustomer = () => {
    createCustomer.mutate({
      name: newCustomer.name,
      email: newCustomer.email || undefined,
      phone: newCustomer.phone || undefined,
      address: newCustomer.address ? JSON.parse(newCustomer.address) : undefined,
      status: newCustomer.status,
    });
    setNewCustomer({ name: '', email: '', phone: '', address: '', status: 'active' });
    setIsCreateDialogOpen(false);
  };

  const handleUpdateCustomerStatus = (customer: Customer, newStatus: string) => {
    updateCustomer.mutate({
      id: customer.id,
      status: newStatus,
    });
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      deleteCustomer.mutate(customerId);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge variant="default" className="flex items-center gap-1">
        <UserCheck className="h-3 w-3" />
        Actif
      </Badge>
    ) : (
      <Badge variant="secondary" className="flex items-center gap-1">
        <UserX className="h-3 w-3" />
        Inactif
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Users className="mr-2 h-6 w-6" />
              Gestion des Clients
            </h1>
            <p className="text-muted-foreground">Gérer les profils clients et leur historique</p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter Client
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un nouveau client</DialogTitle>
                  <DialogDescription>
                    Ajoutez les informations du nouveau client.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Nom</Label>
                    <Input
                      id="name"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                      className="col-span-3"
                      placeholder="Nom complet"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                      className="col-span-3"
                      placeholder="email@exemple.com"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">Téléphone</Label>
                    <Input
                      id="phone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                      className="col-span-3"
                      placeholder="+243..."
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="address" className="text-right">Adresse</Label>
                    <Textarea
                      id="address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})}
                      className="col-span-3"
                      placeholder='{"street": "...", "city": "Kinshasa"}'
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">Statut</Label>
                    <Select value={newCustomer.status} onValueChange={(value) => setNewCustomer({...newCustomer, status: value})}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateCustomer} disabled={!newCustomer.name}>
                    Créer Client
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Liste des Clients ({filteredCustomers.length})</CardTitle>
            <CardDescription>Vue d'ensemble et gestion des clients</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>Aucun client trouvé</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center gap-3 p-4 rounded-lg bg-background border hover:shadow-md transition-shadow">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {customer.name.split(' ').map(name => name[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-medium">{customer.name}</div>
                        {getStatusBadge(customer.status || 'active')}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {customer.email && <div>Email: {customer.email}</div>}
                        {customer.phone && <div>Téléphone: {customer.phone}</div>}
                        <div className="flex gap-4">
                          <span>Commandes: {customer.orders_count || 0}</span>
                          <span>Total dépensé: {formatCurrency(customer.total_spent || 0)}</span>
                        </div>
                        {customer.last_order_date && (
                          <div>Dernière commande: {new Date(customer.last_order_date).toLocaleDateString('fr-FR')}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Select 
                        value={customer.status || 'active'} 
                        onValueChange={(newStatus) => handleUpdateCustomerStatus(customer, newStatus)}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Actif</SelectItem>
                          <SelectItem value="inactive">Inactif</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Détails du client sélectionné */}
        {selectedCustomer && (
          <Card>
            <CardHeader>
              <CardTitle>Profil de {selectedCustomer.name}</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedCustomer(null)}
                className="w-fit"
              >
                Fermer
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Informations personnelles</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Nom:</strong> {selectedCustomer.name}</div>
                    {selectedCustomer.email && (
                      <div><strong>Email:</strong> {selectedCustomer.email}</div>
                    )}
                    {selectedCustomer.phone && (
                      <div><strong>Téléphone:</strong> {selectedCustomer.phone}</div>
                    )}
                    <div><strong>Statut:</strong> {getStatusBadge(selectedCustomer.status || 'active')}</div>
                    <div><strong>Client depuis:</strong> {new Date(selectedCustomer.created_at!).toLocaleDateString('fr-FR')}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Statistiques d'achat</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Nombre de commandes:</strong> {selectedCustomer.orders_count || 0}</div>
                    <div><strong>Total dépensé:</strong> {formatCurrency(selectedCustomer.total_spent || 0)}</div>
                    {selectedCustomer.last_order_date && (
                      <div><strong>Dernière commande:</strong> {new Date(selectedCustomer.last_order_date).toLocaleDateString('fr-FR')}</div>
                    )}
                    {selectedCustomer.orders_count && selectedCustomer.total_spent && (
                      <div><strong>Panier moyen:</strong> {formatCurrency(selectedCustomer.total_spent / selectedCustomer.orders_count)}</div>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedCustomer.address && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Adresse</h3>
                  <div className="text-sm bg-muted p-3 rounded">
                    {typeof selectedCustomer.address === 'string' 
                      ? selectedCustomer.address 
                      : JSON.stringify(selectedCustomer.address, null, 2)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
