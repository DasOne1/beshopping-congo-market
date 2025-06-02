import React from 'react';
import { useAppStore } from '@/stores/appStore';
import { useQueryClient } from '@tanstack/react-query';
import type { QueryKey } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { WifiOff } from 'lucide-react';

interface OfflineGuardProps {
  children: React.ReactNode;
  queryKey: QueryKey;
}

export default function OfflineGuard({ children, queryKey }: OfflineGuardProps) {
  const { connection } = useAppStore();
  const queryClient = useQueryClient();
  const cachedData = queryClient.getQueryData(queryKey);

  // Si nous sommes en ligne, afficher normalement
  if (connection.isOnline) {
    return <>{children}</>;
  }

  // Si nous sommes hors ligne mais avons les données en cache
  if (cachedData) {
    return <>{children}</>;
  }

  // Si nous sommes hors ligne et n'avons pas les données
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
      <WifiOff className="h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">Contenu non disponible hors ligne</h2>
      <p className="text-muted-foreground text-center mb-4 max-w-md">
        Cette page n'a pas encore été mise en cache. Vous devez être connecté à Internet pour y accéder.
      </p>
      <Button 
        variant="outline"
        onClick={() => window.history.back()}
      >
        Retourner à la page précédente
      </Button>
    </div>
  );
} 