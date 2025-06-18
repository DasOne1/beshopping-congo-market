
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ProfileHeader } from '@/components/admin/profile/ProfileHeader';
import { ProfileTab } from '@/components/admin/profile/ProfileTab';
import { AdminUsersTab } from '@/components/admin/profile/AdminUsersTab';
import { ActivityTab } from '@/components/admin/profile/ActivityTab';

const AdminProfile = () => {
  const { adminProfile } = useAdminAuth();

  return (
    <div className="space-y-6">
      <ProfileHeader adminProfile={adminProfile} />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Mon Profil</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs Admin</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab adminProfile={adminProfile} />
        </TabsContent>

        <TabsContent value="users">
          <AdminUsersTab adminProfile={adminProfile} />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProfile;
