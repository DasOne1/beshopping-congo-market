
import { useEffect, useRef } from 'react';
import { useAppStore } from '@/stores/appStore';
import { db } from '@/services/offlineStorage';

export const usePerformanceMonitor = () => {
  const { recordRequest } = useAppStore();
  const performanceObserver = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    if ('PerformanceObserver' in window) {
      performanceObserver.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          // Monitor navigation timing
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            const loadTime = navEntry.loadEventEnd - navEntry.fetchStart;
            
            recordRequest(loadTime);
            
            db.logPerformance('api_call', {
              type: 'navigation',
              loadTime,
              domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.fetchStart,
              firstPaint: navEntry.loadEventStart - navEntry.fetchStart,
            });
          }
          
          // Monitor resource loading
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            
            // Log slow resources (> 1s)
            if (resourceEntry.duration > 1000) {
              db.logPerformance('api_call', {
                type: 'slow_resource',
                name: resourceEntry.name,
                duration: resourceEntry.duration,
                size: resourceEntry.transferSize,
              });
            }
          }
          
          // Monitor LCP (Largest Contentful Paint)
          if (entry.entryType === 'largest-contentful-paint') {
            db.logPerformance('api_call', {
              type: 'lcp',
              startTime: entry.startTime,
            });
          }
          
          // Monitor FID (First Input Delay)
          if (entry.entryType === 'first-input') {
            const fidEntry = entry as any; // Type assertion for first-input
            db.logPerformance('api_call', {
              type: 'fid',
              delay: fidEntry.processingStart ? fidEntry.processingStart - entry.startTime : 0,
            });
          }
        });
      });

      // Observe different entry types
      try {
        performanceObserver.current.observe({ 
          entryTypes: ['navigation', 'resource', 'largest-contentful-paint', 'first-input'] 
        });
      } catch (error) {
        console.warn('Performance observer not fully supported:', error);
      }
    }

    // Monitor memory usage if available
    const memoryMonitor = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        
        if (memory) {
          db.logPerformance('api_call', {
            type: 'memory',
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
            timestamp: Date.now(),
          });
        }
      }
    }, 30000); // Every 30 seconds

    return () => {
      if (performanceObserver.current) {
        performanceObserver.current.disconnect();
      }
      clearInterval(memoryMonitor);
    };
  }, [recordRequest]);

  // Function to manually measure performance
  const measurePerformance = (name: string, fn: (...args: any[]) => Promise<any> | any) => {
    return async (...args: any[]) => {
      const startTime = performance.now();
      
      try {
        const result = await fn(...args);
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        recordRequest(duration);
        
        await db.logPerformance('api_call', {
          type: 'custom_measure',
          name,
          duration,
          timestamp: Date.now(),
        });
        
        return result;
      } catch (error) {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        await db.logPerformance('error', {
          type: 'custom_measure_error',
          name,
          duration,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now(),
        });
        
        throw error;
      }
    };
  };

  return {
    measurePerformance,
  };
};
