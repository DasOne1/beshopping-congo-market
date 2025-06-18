
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface RoleBadgeProps {
  role: string;
}

export const RoleBadge = ({ role }: RoleBadgeProps) => {
  const roleConfig = {
    admin: { variant: 'default' as const, label: 'Administrateur' },
    moderator: { variant: 'secondary' as const, label: 'Modérateur' },
    user: { variant: 'outline' as const, label: 'Utilisateur' }
  };

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};
