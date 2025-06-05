
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCustomers } from '@/hooks/useCustomers';
import { useOrders } from '@/hooks/useOrders';
import AdminLayout from '@/components/Admin/AdminLayout';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign,
  Package,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customers, updateCustomer, deleteCustomer } = useCustomers();
  const { orders, updateOrderStatus } = useOrders();
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      commune: ''
    },
    status: 'active'
  });

  const customer = customers.find(c => c.id === id);
  const customerOrders = orders.filter(order => order.customer_id === id);

  React.useEffect(() => {
    if (customer) {
      setEditForm({
        name: customer.name,
        email: customer.email || '',
        phone: customer.phone || '',
        address: {
          street: customer.address?.street || '',
          city: customer.address?.city || '',
          commune: customer.address?.commune || ''
        },
        status: customer.status || 'active'
      });
    }
  }, [customer]);

  if (!customer) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Client non trouvé</h2>
            <p className="text-muted-foreground mb-4">Le client que vous recherchez n'existe pas.</p>
            <Button onClick={() => navigate('/admin/customers')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux clients
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const handleEditSubmit = async () => {
    try {
      await updateCustomer.mutateAsync({
        id: customer.id,
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        status: editForm.status
      });
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCustomer.mutateAsync(customer.id);
      navigate('/admin/customers');
      toast({
        title: "Client supprimé",
        description: "Le client a été supprimé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/admin/customers')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{customer.name}</h1>
              <p className="text-muted-foreground">Détails et historique du client</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Modifier le client</DialogTitle>
                  <DialogDescription>
                    Modifiez les informations du client
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="street">Rue</Label>
                    <Input
                      id="street"
                      value={editForm.address.street}
                      onChange={(e) => setEditForm({ 
                        ...editForm, 
                        address: { ...editForm.address, street: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={editForm.address.city}
                      onChange={(e) => setEditForm({ 
                        ...editForm, 
                        address: { ...editForm.address, city: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="commune">Commune</Label>
                    <Input
                      id="commune"
                      value={editForm.address.commune}
                      onChange={(e) => setEditForm({ 
                        ...editForm, 
                        address: { ...editForm.address, commune: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Statut</Label>
                    <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleEditSubmit} disabled={updateCustomer.isPending}>
                    {updateCustomer.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Supprimer le client</DialogTitle>
                  <DialogDescription>
                    Êtes-vous sûr de vouloir supprimer ce client ? Cette action est irréversible.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={deleteCustomer.isPending}>
                    {deleteCustomer.isPending ? 'Suppression...' : 'Supprimer'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Statut:</span>
                <Badge className={getStatusColor(customer.status)}>
                  {customer.status || 'active'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{customer.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{customer.phone || 'N/A'}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  {customer.address ? (
                    <div>
                      <div>{customer.address.street}</div>
                      <div>{customer.address.city}</div>
                      {customer.address.commune && <div>{customer.address.commune}</div>}
                    </div>
                  ) : 'N/A'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>
                  Inscrit {formatDistanceToNow(new Date(customer.created_at!), { addSuffix: true, locale: fr })}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total dépensé:</span>
                <span className="text-2xl font-bold">{(customer.total_spent || 0).toLocaleString()} CDF</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Nombre de commandes:</span>
                <span className="text-xl font-semibold">{customer.orders_count || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Dernière commande:</span>
                <span>
                  {customer.last_order_date 
                    ? formatDistanceToNow(new Date(customer.last_order_date), { addSuffix: true, locale: fr })
                    : 'Aucune'
                  }
                </span>
              </div>
              {customerOrders.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Panier moyen:</span>
                  <span className="font-semibold">
                    {Math.round((customer.total_spent || 0) / customerOrders.length).toLocaleString()} CDF
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Historique des commandes ({customerOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customerOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Articles</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.order_number}
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(order.created_at!), { addSuffix: true, locale: fr })}
                      </TableCell>
                      <TableCell>
                        <Badge className={getOrderStatusColor(order.status || 'pending')}>
                          {order.status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {order.total_amount.toLocaleString()} CDF
                      </TableCell>
                      <TableCell>
                        {order.order_items?.length || 0} article(s)
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/orders`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {order.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => updateOrderStatus.mutateAsync({ id: order.id, status: 'confirmed' })}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucune commande trouvée pour ce client</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CustomerDetails;
