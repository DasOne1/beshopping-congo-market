
import React from 'react';
import { AdminProfile } from '@/hooks/useAdminAuth';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SecurityForm } from './SecurityForm';

interface ProfileTabProps {
    adminProfile: AdminProfile | null;
}

export const ProfileTab = ({ adminProfile }: ProfileTabProps) => {
    return (
        <div className="space-y-6">
            <PersonalInfoForm adminProfile={adminProfile} />
            <SecurityForm />
        </div>
    );
}
