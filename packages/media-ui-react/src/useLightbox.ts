import { useState, useCallback, useEffect } from 'react';
import { GenericMediaItem, LightboxPropGetters } from './types.js';

export interface UseLightboxOptions {
  items: GenericMediaItem[];
  initialIndex?: number;
  isOpen?: boolean;
  onClose?: () => void;
  onView?: (item: GenericMediaItem) => void;
  onDownload?: (item: GenericMediaItem) => void;
}

export interface UseLightboxReturn extends LightboxPropGetters {
  isOpen: boolean;
  activeIndex: number;
  activeItem: GenericMediaItem | null;
  openAt: (index: number) => void;
  close: () => void;
  next: () => void;
  prev: () => void;
  downloadCurrent: () => void;
}

export function useLightbox(options: UseLightboxOptions): UseLightboxReturn {
  const { items, initialIndex = 0, isOpen: controlledIsOpen, onClose, onView, onDownload } = options;

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const activeItem = isOpen && items.length > 0 && items[activeIndex] ? items[activeIndex] : null;

  const openAt = useCallback((index: number) => {
    setActiveIndex(index);
    setInternalIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setInternalIsOpen(false);
    onClose?.();
  }, [onClose]);

  const next = useCallback(() => {
    if (activeIndex < items.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  }, [activeIndex, items.length]);

  const prev = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  }, [activeIndex]);

  const downloadCurrent = useCallback(() => {
    if (activeItem) {
      onDownload?.(activeItem);
      // Trigger browser download
      const a = document.createElement('a');
      a.href = activeItem.originalUrl || activeItem.previewUrl;
      a.target = '_blank';
      a.download = `media-${activeItem.id}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [activeItem, onDownload]);

  // Track view when active item changes
  useEffect(() => {
    if (isOpen && activeItem) {
      onView?.(activeItem);
    }
  }, [isOpen, activeItem, onView]);

  // Keyboard navigation & accessibility
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        close();
      } else if (e.key === 'ArrowRight') {
        next();
      } else if (e.key === 'ArrowLeft') {
        prev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, close, next, prev]);

  const getBackdropProps = useCallback(
    () => ({
      role: 'dialog',
      'aria-modal': true,
      tabIndex: -1,
      onClick: (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) close();
      },
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') close();
      },
    }),
    [close]
  );

  const getCloseButtonProps = useCallback(
    () => ({
      'aria-label': 'Close Lightbox Modal',
      onClick: close,
    }),
    [close]
  );

  const getNextButtonProps = useCallback(
    () => ({
      'aria-label': 'Next Media Item',
      onClick: next,
      disabled: activeIndex >= items.length - 1,
    }),
    [next, activeIndex, items.length]
  );

  const getPrevButtonProps = useCallback(
    () => ({
      'aria-label': 'Previous Media Item',
      onClick: prev,
      disabled: activeIndex <= 0,
    }),
    [prev, activeIndex]
  );

  return {
    isOpen,
    activeIndex,
    activeItem,
    openAt,
    close,
    next,
    prev,
    downloadCurrent,
    getBackdropProps,
    getCloseButtonProps,
    getNextButtonProps,
    getPrevButtonProps,
  };
}
