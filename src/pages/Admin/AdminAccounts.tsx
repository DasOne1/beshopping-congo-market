
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UserPlus, Edit, Trash2, Shield, ShieldOff } from 'lucide-react';
import { useAdminAccounts } from '@/hooks/useAdminAccounts';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import AdminLayout from '@/components/Admin/AdminLayout';

const createAccountSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe minimum 6 caractères'),
  fullName: z.string().min(2, 'Nom complet requis'),
});

const updateAccountSchema = z.object({
  email: z.string().email('Email invalide'),
  fullName: z.string().min(2, 'Nom complet requis'),
  role: z.string().min(1, 'Rôle requis'),
});

type CreateAccountForm = z.infer<typeof createAccountSchema>;
type UpdateAccountForm = z.infer<typeof updateAccountSchema>;

const AdminAccounts = () => {
  const { accounts, loading, createAccount, updateAccount, deleteAccount, toggleAccountStatus } = useAdminAccounts();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createForm = useForm<CreateAccountForm>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
    },
  });

  const editForm = useForm<UpdateAccountForm>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      email: '',
      fullName: '',
      role: 'admin',
    },
  });

  const handleCreateAccount = async (data: CreateAccountForm) => {
    setIsSubmitting(true);
    const result = await createAccount(data.email, data.password, data.fullName);
    if (result.success) {
      setIsCreateDialogOpen(false);
      createForm.reset();
    }
    setIsSubmitting(false);
  };

  const handleEditAccount = async (data: UpdateAccountForm) => {
    if (!selectedAccount) return;
    
    setIsSubmitting(true);
    const result = await updateAccount(selectedAccount.id, {
      email: data.email,
      full_name: data.fullName,
      role: data.role,
    });
    if (result.success) {
      setIsEditDialogOpen(false);
      setSelectedAccount(null);
      editForm.reset();
    }
    setIsSubmitting(false);
  };

  const openEditDialog = (account: any) => {
    setSelectedAccount(account);
    editForm.setValue('email', account.email);
    editForm.setValue('fullName', account.full_name);
    editForm.setValue('role', account.role);
    setIsEditDialogOpen(true);
  };

  const handleDeleteAccount = async (account: any) => {
    await deleteAccount(account.id, account.user_id);
  };

  const handleToggleStatus = async (account: any) => {
    await toggleAccountStatus(account.id, account.is_active);
  };

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestion des Comptes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Gérez les comptes administrateurs de votre plateforme
            </p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>Créer un compte</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un nouveau compte administrateur</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau compte administrateur à votre système
                </DialogDescription>
              </DialogHeader>
              <Form {...createForm}>
                <form onSubmit={createForm.handleSubmit(handleCreateAccount)} className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input placeholder="Nom complet" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="admin@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={createForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mot de passe</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Minimum 6 caractères" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Création...' : 'Créer le compte'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Comptes Administrateurs</CardTitle>
            <CardDescription>
              Liste de tous les comptes administrateurs avec leurs statuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.full_name}</TableCell>
                      <TableCell>{account.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{account.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={account.is_active ? "default" : "secondary"}>
                          {account.is_active ? "Actif" : "Inactif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {account.last_login 
                          ? new Date(account.last_login).toLocaleDateString('fr-FR') 
                          : "Jamais"
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(account)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(account)}
                          >
                            {account.is_active ? (
                              <ShieldOff className="h-4 w-4 text-orange-500" />
                            ) : (
                              <Shield className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer le compte</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer le compte de {account.full_name} ? 
                                  Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteAccount(account)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Dialog d'édition */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le compte administrateur</DialogTitle>
              <DialogDescription>
                Modifiez les informations du compte administrateur
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(handleEditAccount)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom complet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rôle</FormLabel>
                      <FormControl>
                        <Input placeholder="admin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </motion.div>
    </AdminLayout>
  );
};

export default AdminAccounts;
