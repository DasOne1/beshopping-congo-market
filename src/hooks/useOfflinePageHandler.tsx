
import { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/appStore';
import { db } from '@/services/offlineStorage';

interface OfflinePageHandlerOptions {
  pageName: string;
  requiredData: string[];
  fallbackDelay?: number;
}

export const useOfflinePageHandler = ({
  pageName,
  requiredData,
  fallbackDelay = 8000 // 8 seconds
}: OfflinePageHandlerOptions) => {
  const { connection } = useAppStore();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showConnectMessage, setShowConnectMessage] = useState(false);
  const [hasOfflineData, setHasOfflineData] = useState(false);

  useEffect(() => {
    checkOfflineData();
    
    // Set up timers for skeleton and connect message
    const skeletonTimer = setTimeout(() => {
      if (!connection.isOnline && !hasOfflineData) {
        setShowSkeleton(false);
        setShowConnectMessage(true);
      }
    }, fallbackDelay);

    return () => {
      clearTimeout(skeletonTimer);
    };
  }, [connection.isOnline, hasOfflineData, fallbackDelay]);

  const checkOfflineData = async () => {
    try {
      let hasData = false;
      
      for (const dataType of requiredData) {
        const cachedData = await db.getCachedData(dataType as any, 'all');
        if (cachedData && Array.isArray(cachedData) && cachedData.length > 0) {
          hasData = true;
          break;
        }
      }
      
      setHasOfflineData(hasData);
      
      if (hasData || connection.isOnline) {
        setShowSkeleton(false);
        setShowConnectMessage(false);
      }
    } catch (error) {
      console.error('Error checking offline data:', error);
      setHasOfflineData(false);
    }
  };

  const resetState = () => {
    setShowSkeleton(true);
    setShowConnectMessage(false);
    checkOfflineData();
  };

  return {
    showSkeleton: showSkeleton && !hasOfflineData && !connection.isOnline,
    showConnectMessage: showConnectMessage && !hasOfflineData && !connection.isOnline,
    hasOfflineData,
    isOnline: connection.isOnline,
    resetState
  };
};
