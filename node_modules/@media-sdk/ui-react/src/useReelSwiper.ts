import { useState, useCallback, useRef } from 'react';
import { GenericMediaItem, SwiperPropGetters } from './types.js';

export interface UseReelSwiperOptions {
  items: GenericMediaItem[];
  initialIndex?: number;
  onActiveIndexChange?: (index: number, item: GenericMediaItem) => void;
  onItemView?: (item: GenericMediaItem) => void;
}

export interface UseReelSwiperReturn extends SwiperPropGetters {
  activeIndex: number;
  activeItem: GenericMediaItem | null;
  scrollToIndex: (index: number) => void;
}

export function useReelSwiper(options: UseReelSwiperOptions): UseReelSwiperReturn {
  const { items, initialIndex = 0, onActiveIndexChange, onItemView } = options;

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLElement | null>(null);

  const activeItem = items[activeIndex] || null;

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      const container = e.currentTarget;
      containerRef.current = container;
      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;

      if (clientHeight === 0) return;

      const newIndex = Math.round(scrollTop / clientHeight);

      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < items.length) {
        setActiveIndex(newIndex);
        const item = items[newIndex];
        if (item) {
          onActiveIndexChange?.(newIndex, item);
          onItemView?.(item);
        }
      }
    },
    [activeIndex, items, onActiveIndexChange, onItemView]
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      if (containerRef.current && index >= 0 && index < items.length) {
        const height = containerRef.current.clientHeight;
        containerRef.current.scrollTo({
          top: index * height,
          behavior: 'smooth',
        });
        setActiveIndex(index);
      }
    },
    [items.length]
  );

  const getContainerProps = useCallback(
    () => ({
      role: 'region',
      'aria-label': 'Vertical Video Reels Feed',
      tabIndex: 0,
      onScroll: handleScroll,
    }),
    [handleScroll]
  );

  const getSlideProps = useCallback(
    (index: number) => ({
      key: String(items[index]?.id || index),
      'data-active': index === activeIndex,
    }),
    [activeIndex, items]
  );

  return {
    activeIndex,
    activeItem,
    scrollToIndex,
    getContainerProps,
    getSlideProps,
  };
}
