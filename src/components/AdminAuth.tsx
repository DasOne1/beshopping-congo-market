
import React from 'react';

interface AdminAuthProps {
  children: React.ReactNode;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ children }) => {
  // Accès direct sans authentification pour simplifier l'utilisation
  return <>{children}</>;
};

export default AdminAuth;
