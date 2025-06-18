
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { AdminUserDialog } from '@/components/admin/AdminUserDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminProfile } from '@/hooks/useAdminAuth';
import { formatDate } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { RoleBadge } from '@/components/admin/RoleBadge';

interface AdminUsersTabProps {
    adminProfile: AdminProfile | null;
}

export const AdminUsersTab = ({ adminProfile }: AdminUsersTabProps) => {
    const { adminUsers, isLoading, createAdminUser, isCreating } = useAdminUsers();
    const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);

    const handleCreateUser = (data: any) => {
        createAdminUser(data, {
            onSuccess: () => {
                setIsUserDialogOpen(false);
            }
        });
    };

    return (
        <>
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
                                        <TableCell><RoleBadge role={user.role} /></TableCell>
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
            <AdminUserDialog
                isOpen={isUserDialogOpen}
                onOpenChange={setIsUserDialogOpen}
                onSubmit={handleCreateUser}
                isCreating={isCreating}
            />
        </>
    );
};
