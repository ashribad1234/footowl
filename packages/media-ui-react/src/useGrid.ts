import { useCallback, useRef, useEffect } from 'react';
import { GenericMediaItem, GridPropGetters } from './types.js';

export interface UseGridOptions {
  items: GenericMediaItem[];
  hasMore?: boolean;
  loading?: boolean;
  onLoadMore?: () => void;
  onItemClick?: (item: GenericMediaItem, index: number) => void;
}

export interface UseGridReturn extends GridPropGetters {
  items: GenericMediaItem[];
}

export function useGrid(options: UseGridOptions): UseGridReturn {
  const { items, hasMore = false, loading = false, onLoadMore, onItemClick } = options;
  const observerRef = useRef<IntersectionObserver | null>(null);

  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();

      if (node && hasMore && onLoadMore) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && hasMore && !loading) {
              onLoadMore();
            }
          },
          { rootMargin: '300px' }
        );
        observerRef.current.observe(node);
      }
    },
    [loading, hasMore, onLoadMore]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const getGridProps = useCallback(
    () => ({
      role: 'grid',
      'aria-label': 'Media Gallery Grid',
    }),
    []
  );

  const getGridItemProps = useCallback(
    (item: GenericMediaItem, index: number) => ({
      key: String(item.id),
      role: 'gridcell',
      tabIndex: 0,
      onClick: () => onItemClick?.(item, index),
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onItemClick?.(item, index);
        }
      },
    }),
    [onItemClick]
  );

  const getSentinelProps = useCallback(
    () => ({
      ref: sentinelRef,
      'aria-hidden': true,
    }),
    [sentinelRef]
  );

  return {
    items,
    getGridProps,
    getGridItemProps,
    getSentinelProps,
  };
}
