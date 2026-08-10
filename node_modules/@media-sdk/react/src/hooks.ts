import { useState, useEffect, useCallback, useRef } from 'react';
import {
  MediaItem,
  PhotoItem,
  VideoItem,
  MediaType,
  SearchParams,
  MediaEvent,
  MediaEventListener,
  SDKError,
} from '@media-sdk/core';
import { useMediaClient } from './MediaContext.js';

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
export function useMediaSearch(options: UseMediaSearchOptions = {}): UseMediaSearchResult {
  const client = useMediaClient();
  const { type: initialType = 'photo', perPage = 20, initialQuery = 'nature', autoFetch = true } = options;

  const [query, setQuery] = useState(initialQuery);
  const [mediaType, setMediaType] = useState<MediaType>(initialType);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<SDKError | null>(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const fetchItems = useCallback(
    async (targetQuery: string, targetType: MediaType, pageNum: number, append = false) => {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      try {
        const params: SearchParams = { query: targetQuery, page: pageNum, perPage };
        let res;
        if (targetType === 'video') {
          res = await client.searchVideos(params);
        } else {
          res = await client.searchPhotos(params);
        }

        setPage(res.page);
        setTotalResults(res.totalResults);
        setItems((prev) => (append ? [...prev, ...res.items] : res.items));
      } catch (err: any) {
        setError(err instanceof SDKError ? err : new SDKError(err.message || 'Search failed'));
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [client, perPage]
  );

  const search = useCallback(
    async (newQuery: string, newType?: MediaType) => {
      const activeType = newType || mediaType;
      setQuery(newQuery);
      setMediaType(activeType);
      setPage(1);
      await fetchItems(newQuery, activeType, 1, false);
    },
    [fetchItems, mediaType]
  );

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || items.length >= totalResults) return;
    const nextPage = page + 1;
    await fetchItems(query, mediaType, nextPage, true);
  }, [loading, loadingMore, items.length, totalResults, page, fetchItems, query, mediaType]);

  const refetch = useCallback(async () => {
    await fetchItems(query, mediaType, 1, false);
  }, [fetchItems, query, mediaType]);

  useEffect(() => {
    if (autoFetch && initialQuery) {
      fetchItems(initialQuery, initialType, 1, false);
    }
  }, []);

  const hasMore = items.length < totalResults;

  return {
    items,
    loading,
    loadingMore,
    error,
    page,
    totalResults,
    hasMore,
    search,
    loadMore,
    refetch,
  };
}

/**
 * Hook to subscribe to SDK Event Emitter events in React
 */
export function useMediaEvents(listener: MediaEventListener): void {
  const client = useMediaClient();
  const listenerRef = useRef(listener);
  listenerRef.current = listener;

  useEffect(() => {
    const handler: MediaEventListener = (event) => listenerRef.current(event);
    const unsubView = client.events.on('view', handler);
    const unsubDownload = client.events.on('download', handler);
    const unsubSearch = client.events.on('search', handler);
    const unsubError = client.events.on('error', handler);

    return () => {
      unsubView();
      unsubDownload();
      unsubSearch();
      unsubError();
    };
  }, [client]);
}

/**
 * Helper hook to track view and download activity via React callbacks
 */
export function useMediaActions() {
  const client = useMediaClient();

  const trackView = useCallback(
    (item: MediaItem) => {
      client.trackView(item);
    },
    [client]
  );

  const trackDownload = useCallback(
    (item: MediaItem) => {
      client.trackDownload(item);
    },
    [client]
  );

  return { trackView, trackDownload };
}
