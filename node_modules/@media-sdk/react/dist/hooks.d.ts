import { MediaItem, MediaType, MediaEventListener, SDKError } from '@media-sdk/core';
export interface UseMediaSearchOptions {
    type?: MediaType;
    perPage?: number;
    initialQuery?: string;
    autoFetch?: boolean;
}
export interface UseMediaSearchResult {
    items: MediaItem[];
    loading: boolean;
    loadingMore: boolean;
    error: SDKError | null;
    page: number;
    totalResults: number;
    hasMore: boolean;
    search: (query: string, type?: MediaType) => Promise<void>;
    loadMore: () => Promise<void>;
    refetch: () => Promise<void>;
}
/**
 * Hook for searching media items with infinite pagination support
 */
export declare function useMediaSearch(options?: UseMediaSearchOptions): UseMediaSearchResult;
/**
 * Hook to subscribe to SDK Event Emitter events in React
 */
export declare function useMediaEvents(listener: MediaEventListener): void;
/**
 * Helper hook to track view and download activity via React callbacks
 */
export declare function useMediaActions(): {
    trackView: (item: MediaItem) => void;
    trackDownload: (item: MediaItem) => void;
};
//# sourceMappingURL=hooks.d.ts.map