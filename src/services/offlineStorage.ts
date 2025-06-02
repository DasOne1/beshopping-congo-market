import Dexie, { Table } from 'dexie';

export interface CachedProduct {
  id: string;
  data: any;
  timestamp: number;
  ttl: number;
}

export interface CachedCategory {
  id: string;
  data: any;
  timestamp: number;
  ttl: number;
}

export interface SyncQueue {
  id?: number;
  action: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
  retries: number;
}

export interface PerformanceLog {
  id?: number;
  timestamp: number;
  type: 'cache_hit' | 'cache_miss' | 'api_call' | 'error';
  data: any;
}

export class OfflineDatabase extends Dexie {
  products!: Table<CachedProduct>;
  categories!: Table<CachedCategory>;
  syncQueue!: Table<SyncQueue>;
  performanceLogs!: Table<PerformanceLog>;

  constructor() {
    super('BeShopping_OfflineDB');
    
    this.version(1).stores({
      products: 'id, timestamp, ttl',
      categories: 'id, timestamp, ttl',
      syncQueue: '++id, timestamp, retries',
      performanceLogs: '++id, timestamp, type',
    });
  }

  async isExpired(timestamp: number, ttl: number): Promise<boolean> {
    return Date.now() - timestamp > ttl;
  }

  async getCachedData<T>(table: 'products' | 'categories', id: string): Promise<T | null> {
    try {
      const cached = await this[table].get(id);
      if (!cached) return null;
      
      if (await this.isExpired(cached.timestamp, cached.ttl)) {
        await this[table].delete(id);
        return null;
      }
      
      return cached.data;
    } catch (error) {
      console.error('Error getting cached data:', error);
      return null;
    }
  }

  async setCachedData(
    table: 'products' | 'categories',
    id: string,
    data: any,
    ttl: number = 5 * 60 * 1000 // 5 minutes default
  ): Promise<void> {
    try {
      await this[table].put({
        id,
        data,
        timestamp: Date.now(),
        ttl,
      });
    } catch (error) {
      console.error('Error setting cached data:', error);
    }
  }

  async addToSyncQueue(action: SyncQueue['action'], table: string, data: any): Promise<void> {
    try {
      await this.syncQueue.add({
        action,
        table,
        data,
        timestamp: Date.now(),
        retries: 0,
      });
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  }

  async getSyncQueue(): Promise<SyncQueue[]> {
    return this.syncQueue.orderBy('timestamp').toArray();
  }

  async removeSyncItem(id: number): Promise<void> {
    await this.syncQueue.delete(id);
  }

  async logPerformance(type: PerformanceLog['type'], data: any): Promise<void> {
    try {
      await this.performanceLogs.add({
        timestamp: Date.now(),
        type,
        data,
      });
      
      // Keep only last 1000 logs
      const count = await this.performanceLogs.count();
      if (count > 1000) {
        const oldestLogs = await this.performanceLogs
          .orderBy('timestamp')
          .limit(count - 1000)
          .toArray();
        
        const idsToDelete = oldestLogs.map(log => log.id!);
        await this.performanceLogs.bulkDelete(idsToDelete);
      }
    } catch (error) {
      console.error('Error logging performance:', error);
    }
  }

  async clearExpiredCache(): Promise<void> {
    const now = Date.now();
    
    // Clear expired products
    const expiredProducts = await this.products
      .filter(item => now - item.timestamp > item.ttl)
      .toArray();
    
    if (expiredProducts.length > 0) {
      await this.products.bulkDelete(expiredProducts.map(p => p.id));
    }
    
    // Clear expired categories
    const expiredCategories = await this.categories
      .filter(item => now - item.timestamp > item.ttl)
      .toArray();
    
    if (expiredCategories.length > 0) {
      await this.categories.bulkDelete(expiredCategories.map(c => c.id));
    }
  }
}

export const db = new OfflineDatabase();
