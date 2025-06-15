
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { AdminProfile } from '@/hooks/useAdminAuth';
import { RoleBadge } from '@/components/admin/RoleBadge';

interface ProfileHeaderProps {
  adminProfile: AdminProfile | null;
}

export const ProfileHeader = ({ adminProfile }: ProfileHeaderProps) => {
  if (!adminProfile) return null;

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarFallback className="text-lg">
          {adminProfile.full_name?.split(' ').map(n => n[0]).join('').toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {adminProfile.full_name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">{adminProfile.email}</p>
        <div className="flex items-center gap-2 mt-1">
          <RoleBadge role={adminProfile.role} />
          <Badge variant={adminProfile.is_active ? 'default' : 'destructive'}>
            {adminProfile.is_active ? 'Actif' : 'Inactif'}
          </Badge>
        </div>
      </div>
    </div>
  );
};
