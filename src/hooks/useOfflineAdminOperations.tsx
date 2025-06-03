
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { db } from '@/services/offlineStorage';
import { useAppStore } from '@/stores/appStore';
import { Product, Category } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface OfflineOperation {
  id?: number;
  type: 'product' | 'category';
  action: 'create' | 'update' | 'delete';
  data: any;
  tempId?: string;
  timestamp: number;
  retries: number;
}

export const useOfflineAdminOperations = () => {
  const { connection } = useAppStore();
  const queryClient = useQueryClient();
  const [pendingOperations, setPendingOperations] = useState<OfflineOperation[]>([]);

  // Load pending operations on mount
  useEffect(() => {
    loadPendingOperations();
  }, []);

  // Sync when coming back online
  useEffect(() => {
    if (connection.isOnline && pendingOperations.length > 0) {
      syncPendingOperations();
    }
  }, [connection.isOnline]);

  const loadPendingOperations = async () => {
    try {
      const operations = await db.getSyncQueue();
      // Convert SyncQueue to OfflineOperation format
      const formattedOperations: OfflineOperation[] = operations.map(op => ({
        id: op.id,
        type: op.table === 'products' ? 'product' : 'category',
        action: op.action as 'create' | 'update' | 'delete',
        data: op.data,
        timestamp: op.timestamp || Date.now(),
        retries: 0
      }));
      setPendingOperations(formattedOperations);
    } catch (error) {
      console.error('Error loading pending operations:', error);
    }
  };

  const addOfflineOperation = async (operation: Omit<OfflineOperation, 'timestamp' | 'retries'>) => {
    const fullOperation: OfflineOperation = {
      ...operation,
      timestamp: Date.now(),
      retries: 0
    };

    try {
      // Store in IndexedDB
      await db.addToSyncQueue(
        fullOperation.action,
        fullOperation.type + 's', // products or categories
        fullOperation.data
      );

      // Update local state
      setPendingOperations(prev => [...prev, fullOperation]);

      // Apply optimistic update to cache
      applyOptimisticUpdate(fullOperation);

      toast({
        title: "Opération enregistrée hors ligne",
        description: "L'opération sera synchronisée dès la reconnexion.",
      });
    } catch (error) {
      console.error('Error adding offline operation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'opération hors ligne.",
        variant: "destructive",
      });
    }
  };

  const applyOptimisticUpdate = (operation: OfflineOperation) => {
    const queryKey = operation.type === 'product' ? ['products-optimized'] : ['categories'];
    
    queryClient.setQueryData(queryKey, (oldData: any[] = []) => {
      switch (operation.action) {
        case 'create':
          const newItem = {
            ...operation.data,
            id: operation.tempId || `temp-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          return [newItem, ...oldData];

        case 'update':
          return oldData.map(item =>
            item.id === operation.data.id ? { ...item, ...operation.data } : item
          );

        case 'delete':
          return oldData.filter(item => item.id !== operation.data.id);

        default:
          return oldData;
      }
    });
  };

  const syncPendingOperations = async () => {
    if (!connection.isOnline) return;

    console.log(`Syncing ${pendingOperations.length} pending admin operations`);

    for (const operation of pendingOperations) {
      try {
        await syncSingleOperation(operation);
        
        // Remove from IndexedDB
        if (operation.id) {
          await db.removeSyncItem(operation.id);
        }
        
        // Remove from local state
        setPendingOperations(prev => prev.filter(op => op.id !== operation.id));

        toast({
          title: "Synchronisation réussie",
          description: `${operation.type} ${operation.action} synchronisé(e)`,
        });
      } catch (error) {
        console.error('Failed to sync operation:', operation, error);
        
        // Increment retry count
        if (operation.retries < 3) {
          setPendingOperations(prev =>
            prev.map(op =>
              op.id === operation.id ? { ...op, retries: op.retries + 1 } : op
            )
          );
        } else {
          // Remove after 3 failed retries
          setPendingOperations(prev => prev.filter(op => op.id !== operation.id));
          if (operation.id) {
            await db.removeSyncItem(operation.id);
          }
        }
      }
    }

    // Refresh data after sync
    queryClient.invalidateQueries({ queryKey: ['products-optimized'] });
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  const syncSingleOperation = async (operation: OfflineOperation) => {
    const table = operation.type === 'product' ? 'products' : 'categories';
    
    switch (operation.action) {
      case 'create':
        const { data: createData, error: createError } = await supabase
          .from(table)
          .insert([operation.data])
          .select()
          .single();
        
        if (createError) throw createError;
        return createData;

      case 'update':
        const { data: updateData, error: updateError } = await supabase
          .from(table)
          .update(operation.data)
          .eq('id', operation.data.id)
          .select()
          .single();
        
        if (updateError) throw updateError;
        return updateData;

      case 'delete':
        const { error: deleteError } = await supabase
          .from(table)
          .delete()
          .eq('id', operation.data.id);
        
        if (deleteError) throw deleteError;
        return null;

      default:
        throw new Error(`Unknown operation action: ${operation.action}`);
    }
  };

  // Admin operations for products
  const createProductOffline = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    if (connection.isOnline) {
      // If online, perform normal operation
      return null; // Let the normal hook handle it
    }

    await addOfflineOperation({
      type: 'product',
      action: 'create',
      data: productData,
      tempId: `temp-product-${Date.now()}`
    });
  };

  const updateProductOffline = async (productData: Partial<Product> & { id: string }) => {
    if (connection.isOnline) {
      return null; // Let the normal hook handle it
    }

    await addOfflineOperation({
      type: 'product',
      action: 'update',
      data: productData
    });
  };

  const deleteProductOffline = async (productId: string) => {
    if (connection.isOnline) {
      return null; // Let the normal hook handle it
    }

    await addOfflineOperation({
      type: 'product',
      action: 'delete',
      data: { id: productId }
    });
  };

  // Admin operations for categories
  const createCategoryOffline = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    if (connection.isOnline) {
      return null; // Let the normal hook handle it
    }

    await addOfflineOperation({
      type: 'category',
      action: 'create',
      data: categoryData,
      tempId: `temp-category-${Date.now()}`
    });
  };

  const updateCategoryOffline = async (categoryData: Partial<Category> & { id: string }) => {
    if (connection.isOnline) {
      return null; // Let the normal hook handle it
    }

    await addOfflineOperation({
      type: 'category',
      action: 'update',
      data: categoryData
    });
  };

  const deleteCategoryOffline = async (categoryId: string) => {
    if (connection.isOnline) {
      return null; // Let the normal hook handle it
    }

    await addOfflineOperation({
      type: 'category',
      action: 'delete',
      data: { id: categoryId }
    });
  };

  return {
    pendingOperations,
    syncPendingOperations,
    createProductOffline,
    updateProductOffline,
    deleteProductOffline,
    createCategoryOffline,
    updateCategoryOffline,
    deleteCategoryOffline,
  };
};
