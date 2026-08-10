---
name: media-ui-react-components
description: Guides AI assistants on correctly using @media-sdk/ui-react pure headless UI components, hooks, prop-getters, unstyled rendering contract, and accessibility (a11y).
---

# Skill: Consuming Headless Components with `@media-sdk/ui-react`

This skill teaches AI coding assistants how to correctly consume pure headless components from `@media-sdk/ui-react` (`useGrid`, `useLightbox`, `useReelSwiper`).

## Core Principles

1. **Zero Library Imports from Core:** `@media-sdk/ui-react` is 100% decoupled from `media-core` and `media-react`.
2. **Prop-Getters Pattern:** Components expose prop-getter functions (`getGridProps`, `getGridItemProps`, `getBackdropProps`, etc.) that spread ARIA attributes, event handlers, and keyboard shortcuts onto consumer DOM elements.
3. **Consumer Brings Styles:** No baked-in CSS styles exist. The application consumer supplies all CSS classes, glassmorphism, flexbox, or grid layouts.

---

## 1. Headless Grid with Infinite Scroll (`useGrid`)

```tsx
import { useGrid, GenericMediaItem } from '@media-sdk/ui-react';

interface Props {
  items: GenericMediaItem[];
  hasMore: boolean;
  onLoadMore: () => void;
  onSelect: (item: GenericMediaItem, index: number) => void;
}

export function HeadlessGrid({ items, hasMore, onLoadMore, onSelect }: Props) {
  const { getGridProps, getGridItemProps, getSentinelProps } = useGrid({
    items,
    hasMore,
    onLoadMore,
    onItemClick: onSelect,
  });

  return (
    <div {...getGridProps()} className="my-custom-grid-css">
      {items.map((item, index) => {
        const itemProps = getGridItemProps(item, index);
        return (
          <div {...itemProps} className="my-card-css">
            <img src={item.previewUrl} alt={item.title} />
          </div>
        );
      })}

      {/* Intersection Observer Sentinel for Infinite Scroll */}
      <div {...getSentinelProps()} className="sentinel-loader" />
    </div>
  );
}
```

---

## 2. Accessible Lightbox Modal (`useLightbox`)

```tsx
import { useLightbox, GenericMediaItem } from '@media-sdk/ui-react';

export function HeadlessLightbox({ items, isOpen, onClose }: { items: GenericMediaItem[]; isOpen: boolean; onClose: () => void }) {
  const {
    activeItem,
    getBackdropProps,
    getCloseButtonProps,
    getNextButtonProps,
    getPrevButtonProps,
    downloadCurrent,
  } = useLightbox({
    items,
    isOpen,
    onClose,
  });

  if (!isOpen || !activeItem) return null;

  return (
    <div {...getBackdropProps()} className="modal-backdrop">
      <div className="modal-content">
        <img src={activeItem.originalUrl} alt={activeItem.title} />
        
        <div className="modal-actions">
          <button {...getPrevButtonProps()}>Prev</button>
          <button {...getNextButtonProps()}>Next</button>
          <button onClick={downloadCurrent}>Download</button>
          <button {...getCloseButtonProps()}>Close</button>
        </div>
      </div>
    </div>
  );
}
```

---

## 3. TikTok-Style Vertical Snap Swiper (`useReelSwiper`)

```tsx
import { useReelSwiper, GenericMediaItem } from '@media-sdk/ui-react';

export function HeadlessReelSwiper({ items }: { items: GenericMediaItem[] }) {
  const { activeIndex, getContainerProps, getSlideProps } = useReelSwiper({ items });

  return (
    <div {...getContainerProps()} className="reels-scroll-container">
      {items.map((item, index) => {
        const slideProps = getSlideProps(index);
        const isActive = index === activeIndex;

        return (
          <div {...slideProps} className="reel-slide">
            <video src={item.videoUrl} autoPlay={isActive} muted loop />
          </div>
        );
      })}
    </div>
  );
}
```
