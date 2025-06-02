
import { useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';
import { useQueryClient } from '@tanstack/react-query';
import { db } from '@/services/offlineStorage';

export const useNetworkStatus = () => {
  const { setOnlineStatus, setReconnecting, updateLastSync } = useAppStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = async () => {
      console.log('🟢 Connection restored');
      setOnlineStatus(true);
      setReconnecting(true);
      
      try {
        // Sync queued operations
        await syncQueuedOperations();
        
        // Refresh stale data
        await queryClient.refetchQueries({
          stale: true,
          type: 'active',
        });
        
        updateLastSync();
      } catch (error) {
        console.error('Error during reconnection sync:', error);
      } finally {
        setReconnecting(false);
      }
    };

    const handleOffline = () => {
      console.log('🔴 Connection lost');
      setOnlineStatus(false);
      setReconnecting(false);
    };

    // Set initial status
    setOnlineStatus(navigator.onLine);

    // Listen for connection changes
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic connectivity check
    const connectivityCheck = setInterval(async () => {
      try {
        const response = await fetch('/api/health', {
          method: 'HEAD',
          cache: 'no-cache',
        });
        
        if (!response.ok && navigator.onLine) {
          handleOffline();
        }
      } catch (error) {
        if (navigator.onLine) {
          handleOffline();
        }
      }
    }, 30000); // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(connectivityCheck);
    };
  }, [setOnlineStatus, setReconnecting, updateLastSync, queryClient]);

  const syncQueuedOperations = async () => {
    try {
      const queuedOperations = await db.getSyncQueue();
      console.log(`Syncing ${queuedOperations.length} queued operations`);
      
      for (const operation of queuedOperations) {
        try {
          // Process queued operation based on type
          await processQueuedOperation(operation);
          await db.removeSyncItem(operation.id!);
        } catch (error) {
          console.error('Failed to sync operation:', operation, error);
          
          // Increment retry count
          if (operation.retries < 3) {
            await db.syncQueue.update(operation.id!, {
              retries: operation.retries + 1,
            });
          } else {
            // Remove after 3 failed retries
            await db.removeSyncItem(operation.id!);
          }
        }
      }
    } catch (error) {
      console.error('Error syncing queued operations:', error);
    }
  };

  const processQueuedOperation = async (operation: any) => {
    // Implementation depends on your specific operations
    console.log('Processing queued operation:', operation);
    // Add your sync logic here
  };
};
