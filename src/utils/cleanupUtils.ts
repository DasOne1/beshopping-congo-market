
// Utilitaire pour la gestion des erreurs sans bloquer l'UI
export const safeAsync = async <T>(
  asyncFn: () => Promise<T>,
  fallback: T,
  errorMessage?: string
): Promise<T> => {
  try {
    return await asyncFn();
  } catch (error) {
    console.error(errorMessage || 'Erreur silencieuse:', error);
    return fallback;
  }
};

// Cache en mémoire pour éviter les requêtes redondantes
const memoryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();

export const getCachedData = <T>(key: string): T | null => {
  const cached = memoryCache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  memoryCache.delete(key);
  return null;
};

export const setCachedData = <T>(key: string, data: T, ttl: number = 300000): void => {
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
};

// Debounce pour optimiser les requêtes
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle pour limiter les appels fréquents
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
