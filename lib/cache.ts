// utils/cache.ts

// 1. Función para LEER el caché de forma segura
export function getCache<T>(key: string): T | null {
  if (typeof window === 'undefined') return null; // Evita errores en el servidor de Next.js
  
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error leyendo el caché [${key}]:`, error);
    return null;
  }
}

// 2. Función para GUARDAR en el caché de forma segura
export function setCache<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error guardando en el caché [${key}]:`, error);
  }
}