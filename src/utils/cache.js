const CACHE_KEY = 'mermaid-diagrams';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

export const cacheService = {
  set: (key, value) => {
    const item = {
      value,
      timestamp: Date.now()
    };
    localStorage.setItem(`${CACHE_KEY}-${key}`, JSON.stringify(item));
  },

  get: (key) => {
    const item = localStorage.getItem(`${CACHE_KEY}-${key}`);
    if (!item) return null;

    const { value, timestamp } = JSON.parse(item);
    if (Date.now() - timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(`${CACHE_KEY}-${key}`);
      return null;
    }
    return value;
  }
};