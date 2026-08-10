---
name: media-react-data-wiring
description: Guides AI assistants on correctly integrating and consuming @media-sdk/react and @media-sdk/core for authentication, context provider setup, data fetching hooks, and event subscription.
---

# Skill: Wiring Data with `@media-sdk/react`

This skill provides step-by-step rules and code snippets for AI coding agents when integrating `@media-sdk/react` and `@media-sdk/core` into web or mobile React applications.

## Key Rules & Guidelines

1. **Provider Requirement:** Always wrap the root application (or target subtree) with `<MediaProvider>`.
2. **API Key Safety:** Pass the API key using environment variables (e.g., `import.meta.env.VITE_PEXELS_API_KEY`).
3. **No Direct UI Dependencies:** `@media-sdk/react` handles data fetching, state, and event tracking ONLY. It must not generate DOM layout or CSS.
4. **Data Normalization:** Translate SDK response items (`MediaItem`) to pure UI generic interfaces (`GenericMediaItem`) at the app level using an adapter function.

---

## 1. Provider & Authentication Setup

```tsx
import React from 'react';
import { MediaProvider } from '@media-sdk/react';

export function RootApp() {
  return (
    <MediaProvider apiKey={import.meta.env.VITE_PEXELS_API_KEY}>
      <YourAppContent />
    </MediaProvider>
  );
}
```

---

## 2. Searching & Data Fetching Hooks

Use `useMediaSearch()` for infinite media search (Photos and Videos):

```tsx
import { useMediaSearch } from '@media-sdk/react';

export function MediaSearchContainer() {
  const {
    items,          // Array of MediaItem objects
    loading,        // Initial load state
    loadingMore,    // Paginated load state
    error,          // SDKError | null
    search,         // (query: string, type?: 'photo' | 'video') => Promise<void>
    loadMore,       // () => Promise<void>
    hasMore,        // boolean
  } = useMediaSearch({
    initialQuery: 'mountains',
    type: 'photo',
    perPage: 20,
  });

  return (
    <div>
      {/* Search Input Controls */}
      <button onClick={() => search('ocean', 'photo')}>Search Ocean</button>

      {/* Media Items */}
      {loading ? <p>Loading...</p> : items.map((item) => <div key={item.id}>{item.title}</div>)}

      {/* Infinite Scroll Trigger */}
      {hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
}
```

---

## 3. Subscribing to SDK Activity Events

Listen to SDK activity events (`view`, `download`, `search`, `error`) for analytics or logging:

```tsx
import { useMediaEvents, useMediaActions } from '@media-sdk/react';

export function AnalyticsTracker() {
  // Listen to all SDK events
  useMediaEvents((event) => {
    console.log(`[SDK Event] ${event.type}`, event.data);
  });

  const { trackView, trackDownload } = useMediaActions();

  return { trackView, trackDownload };
}
```
