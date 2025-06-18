
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Edit } from 'lucide-react';
import { AdminProfile } from '@/hooks/useAdminAuth';
import { formatDate } from '@/lib/utils';

interface PersonalInfoFormProps {
    adminProfile: AdminProfile | null;
}

export const PersonalInfoForm = ({ adminProfile }: PersonalInfoFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Mise à jour du profil...');
        setIsEditing(false);
    };

    if (!adminProfile) return null;

    return (
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
                      defaultValue={adminProfile.full_name}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue={adminProfile.email}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle</Label>
                    <Input
                      id="role"
                      defaultValue={adminProfile.role}
                      disabled
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="createdAt">Membre depuis</Label>
                    <Input
                      id="createdAt"
                      defaultValue={formatDate(adminProfile.created_at || '')}
                      disabled
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastLogin">Dernière connexion</Label>
                    <Input
                      id="lastLogin"
                      defaultValue={adminProfile.last_login ? formatDate(adminProfile.last_login) : 'Jamais'}
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
    );
}
