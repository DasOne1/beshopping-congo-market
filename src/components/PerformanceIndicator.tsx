
import React, { memo, useEffect, useState } from 'react';
import { useAppStore } from '@/stores/appStore';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

const PerformanceIndicator = memo(() => {
  const { connection, performance } = useAppStore();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Auto-hide details after 3 seconds
    if (showDetails) {
      const timer = setTimeout(() => setShowDetails(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showDetails]);

  const getConnectionColor = () => {
    if (!connection.isOnline) return 'bg-red-500';
    if (connection.isReconnecting) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getConnectionIcon = () => {
    if (!connection.isOnline) return WifiOff;
    if (connection.isReconnecting) return RefreshCw;
    return Wifi;
  };

  const formatLoadTime = (time: number) => {
    return `${Math.round(time)}ms`;
  };

  const formatCacheRatio = (ratio: number) => {
    return `${Math.round(ratio)}%`;
  };

  const ConnectionIcon = getConnectionIcon();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {/* Main indicator */}
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <Badge
          variant="secondary"
          className={cn(
            "transition-colors duration-200",
            !connection.isOnline && "bg-red-100 text-red-800 border-red-200",
            connection.isReconnecting && "bg-yellow-100 text-yellow-800 border-yellow-200"
          )}
        >
          <ConnectionIcon 
            className={cn(
              "h-3 w-3 mr-1",
              connection.isReconnecting && "animate-spin"
            )} 
          />
          {!connection.isOnline ? 'Hors ligne' : 
           connection.isReconnecting ? 'Synchronisation...' : 'En ligne'}
        </Badge>
      </div>

      {/* Detailed performance metrics */}
      {showDetails && (
        <div className="bg-background/95 backdrop-blur border rounded-lg p-3 space-y-2 shadow-lg min-w-[200px]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Temps de chargement:</span>
            <span className="font-mono">{formatLoadTime(performance.averageLoadTime)}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Cache hit ratio:</span>
            <span className="font-mono">{formatCacheRatio(performance.cacheHitRatio)}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Requêtes totales:</span>
            <span className="font-mono">{performance.totalRequests}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Dernière sync:</span>
            <span className="font-mono text-xs">
              {new Date(connection.lastSyncTime).toLocaleTimeString()}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 pt-1 border-t">
            <Activity className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Performance monitoring
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

PerformanceIndicator.displayName = 'PerformanceIndicator';

export default PerformanceIndicator;
