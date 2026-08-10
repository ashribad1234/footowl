"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryCache = void 0;
/**
 * In-Memory TTL Cache and Request Deduplication helper
 */
class InMemoryCache {
    defaultTtlMs;
    cache = new Map();
    pendingRequests = new Map();
    constructor(defaultTtlMs = 300000) {
        this.defaultTtlMs = defaultTtlMs;
    } // 5 minutes default
    /**
     * Deduplicate identical in-flight promises or return cached result if valid
     */
    async getOrFetch(key, fetchFn, ttlMs = this.defaultTtlMs) {
        // 1. Check cache
        const cached = this.cache.get(key);
        if (cached && Date.now() < cached.expiresAt) {
            return cached.value;
        }
        // 2. Deduplicate in-flight pending requests
        if (this.pendingRequests.has(key)) {
            return this.pendingRequests.get(key);
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
    clear() {
        this.cache.clear();
        this.pendingRequests.clear();
    }
}
exports.InMemoryCache = InMemoryCache;
//# sourceMappingURL=cache.js.map