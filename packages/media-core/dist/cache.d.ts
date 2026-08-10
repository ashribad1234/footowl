/**
 * In-Memory TTL Cache and Request Deduplication helper
 */
export declare class InMemoryCache {
    private defaultTtlMs;
    private cache;
    private pendingRequests;
    constructor(defaultTtlMs?: number);
    /**
     * Deduplicate identical in-flight promises or return cached result if valid
     */
    getOrFetch<T>(key: string, fetchFn: () => Promise<T>, ttlMs?: number): Promise<T>;
    /**
     * Clear cache contents
     */
    clear(): void;
}
//# sourceMappingURL=cache.d.ts.map