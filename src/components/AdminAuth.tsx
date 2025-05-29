
import React from 'react';

interface AdminAuthProps {
  children: React.ReactNode;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ children }) => {
  // Plus besoin d'authentification, on affiche directement les enfants
  return <>{children}</>;
};

export default AdminAuth;
