import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Shield, Clock, Users, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { formatDate } from '@/lib/utils';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { AdminUserDialog } from '@/components/admin/AdminUserDialog';
import { Skeleton } from '@/components/ui/skeleton';

const AdminProfile = () => {
  const { adminProfile } = useAdminAuth();
  const [isEditing, setIsEditing] = useState(false);
  const { adminUsers, isLoading, createAdminUser, isCreating } = useAdminUsers();
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Mise à jour du profil...');
    setIsEditing(false);
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { variant: 'default' as const, label: 'Administrateur' },
      moderator: { variant: 'secondary' as const, label: 'Modérateur' },
      user: { variant: 'outline' as const, label: 'Utilisateur' }
    };

    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleCreateUser = (data: any) => {
    createAdminUser(data, {
        onSuccess: () => {
            setIsUserDialogOpen(false);
        }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">
            {adminProfile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {adminProfile?.full_name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{adminProfile?.email}</p>
          <div className="flex items-center gap-2 mt-1">
            {getRoleBadge(adminProfile?.role || 'user')}
            <Badge variant={adminProfile?.is_active ? 'default' : 'destructive'}>
              {adminProfile?.is_active ? 'Actif' : 'Inactif'}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Mon Profil</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs Admin</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </span>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? 'Annuler' : 'Modifier'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      defaultValue={adminProfile?.full_name}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={adminProfile?.email}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Input
                      id="role"
                      defaultValue={adminProfile?.role}
                      disabled
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="createdAt">Membre depuis</Label>
                    <Input
                      id="createdAt"
                      defaultValue={formatDate(adminProfile?.created_at || '')}
                      disabled
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastLogin">Dernière connexion</Label>
                    <Input
                      id="lastLogin"
                      defaultValue={adminProfile?.last_login ? formatDate(adminProfile.last_login) : 'Jamais'}
                      disabled
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      Sauvegarder
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input id="currentPassword" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input id="newPassword" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              
              <Button>
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Utilisateurs administrateurs
                </span>
                {adminProfile?.role === 'admin' && (
                  <Button onClick={() => setIsUserDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvel admin
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell colSpan={6}>
                          <Skeleton className="h-8 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    adminUsers?.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {user.full_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{user.full_name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>
                          <Badge variant={user.is_active ? 'default' : 'destructive'}>
                            {user.is_active ? 'Actif' : 'Inactif'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.last_login ? formatDate(user.last_login) : 'Jamais'}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Connexion réussie</p>
                    <p className="text-sm text-gray-500">Il y a 2 heures</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Produit créé: "Nouveau smartphone"</p>
                    <p className="text-sm text-gray-500">Il y a 1 jour</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Commande mise à jour: #ORD000123</p>
                    <p className="text-sm text-gray-500">Il y a 2 jours</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Paramètres modifiés</p>
                    <p className="text-sm text-gray-500">Il y a 3 jours</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
       <AdminUserDialog 
          isOpen={isUserDialogOpen}
          onOpenChange={setIsUserDialogOpen}
          onSubmit={handleCreateUser}
          isCreating={isCreating}
        />
    </div>
  );
};

export default AdminProfile;
