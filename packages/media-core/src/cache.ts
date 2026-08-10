/**
 * In-Memory TTL Cache and Request Deduplication helper
 */
export class InMemoryCache {
  private cache = new Map<string, { value: any; expiresAt: number }>();
  private pendingRequests = new Map<string, Promise<any>>();

  constructor(private defaultTtlMs: number = 300000) {} // 5 minutes default

  /**
   * Deduplicate identical in-flight promises or return cached result if valid
   */
  public async getOrFetch<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlMs: number = this.defaultTtlMs
  ): Promise<T> {
    // 1. Check cache
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.value as T;
    }

    // 2. Deduplicate in-flight pending requests
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>;
    }

    // 3. Execute request
    const promise = fetchFn()
      .then((result) => {
        this.cache.set(key, {
          value: result,
          expiresAt: Date.now() + ttlMs,
        });
        this.pendingRequests.delete(key);
        return result;
      })
      .catch((err) => {
        this.pendingRequests.delete(key);
        throw err;
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  /**
   * Clear cache contents
   */
  public clear(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }
}
