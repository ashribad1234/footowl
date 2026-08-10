import React, { useState, useMemo } from 'react';
import { useMediaSearch, useMediaEvents, useMediaActions, useMediaClient } from '@media-sdk/react';
import { useGrid, useLightbox, useReelSwiper, GenericMediaItem } from '@media-sdk/ui-react';
import { toGenericMediaItem } from './adapters';
import { Search, Image, Film, Download, X, ChevronLeft, ChevronRight, Activity, Key } from 'lucide-react';

export default function App() {
  const [queryInput, setQueryInput] = useState('nature');
  const [activeTab, setActiveTab] = useState<'photo' | 'video' | 'reels'>('photo');
  const [activityLogs, setActivityLogs] = useState<string[]>([]);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [isFeedOpen, setIsFeedOpen] = useState(true);

  const client = useMediaClient();

  // 1. Data Layer Hook (media-react)
  const searchType = activeTab === 'reels' ? 'video' : activeTab;
  const { items, loading, loadingMore, error, search, loadMore, hasMore, refetch } = useMediaSearch({
    initialQuery: 'nature',
    type: searchType,
    perPage: 18,
  });

  const { trackView, trackDownload } = useMediaActions();

  // Subscribe to Media SDK Activity Events
  useMediaEvents((event) => {
    const timeStr = new Date(event.data.timestamp).toLocaleTimeString();
    const logMsg = `[${timeStr}] ${event.type.toUpperCase()}: ${
      'item' in event.data ? (event.data.item as any).title : JSON.stringify(event.data)
    }`;
    setActivityLogs((prev) => [logMsg, ...prev.slice(0, 15)]);
  });

  // Transform SDK MediaItems to Generic UI Items (Application Adapter)
  const genericItems: GenericMediaItem[] = useMemo(() => {
    return items.map(toGenericMediaItem);
  }, [items]);

  // 2. Headless UI Hooks (media-ui-react)
  const { getGridProps, getGridItemProps, getSentinelProps } = useGrid({
    items: genericItems,
    hasMore,
    loading: loadingMore,
    onLoadMore: loadMore,
    onItemClick: (item, index) => {
      openAt(index);
    },
  });

  const {
    isOpen: isLightboxOpen,
    activeItem: lightboxActiveItem,
    openAt,
    close: closeLightbox,
    downloadCurrent,
    getBackdropProps,
    getCloseButtonProps,
    getNextButtonProps,
    getPrevButtonProps,
  } = useLightbox({
    items: genericItems,
    onView: (item) => {
      const sdkItem = items.find((i) => String(i.id) === String(item.id));
      if (sdkItem) trackView(sdkItem);
    },
    onDownload: (item) => {
      const sdkItem = items.find((i) => String(i.id) === String(item.id));
      if (sdkItem) trackDownload(sdkItem);
    },
  });

  const { activeIndex: activeReelIndex, getContainerProps, getSlideProps } = useReelSwiper({
    items: genericItems,
    onItemView: (item) => {
      const sdkItem = items.find((i) => String(i.id) === String(item.id));
      if (sdkItem) trackView(sdkItem);
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryInput.trim()) {
      search(queryInput.trim(), searchType);
    }
  };

  const handleTabChange = (newTab: 'photo' | 'video' | 'reels') => {
    setActiveTab(newTab);
    const targetType = newTab === 'reels' ? 'video' : newTab;
    search(queryInput, targetType);
  };

  const handleSaveCustomKey = () => {
    if (customKey.trim()) {
      client.setApiKey(customKey.trim());
      setShowKeyInput(false);
      refetch();
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand-title">
          <Activity size={24} className="text-cyan-400" />
          <span>Headless Media Ecosystem</span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search photos or videos..."
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
          />
        </form>

        {/* Tab Switcher */}
        <div className="tab-group">
          <button
            className={`tab-btn ${activeTab === 'photo' ? 'active' : ''}`}
            onClick={() => handleTabChange('photo')}
          >
            <Image size={14} style={{ display: 'inline', marginRight: 6 }} /> Photos
          </button>
          <button
            className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => handleTabChange('video')}
          >
            <Film size={14} style={{ display: 'inline', marginRight: 6 }} /> Videos
          </button>
          <button
            className={`tab-btn ${activeTab === 'reels' ? 'active' : ''}`}
            onClick={() => handleTabChange('reels')}
          >
            🎬 Reels View
          </button>
        </div>

        {/* API Key Configuration Button */}
        <button
          className="action-btn"
          style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
          onClick={() => setShowKeyInput(!showKeyInput)}
        >
          <Key size={14} /> Pexels Key
        </button>
      </header>

      {/* API Key Modal Banner */}
      {showKeyInput && (
        <div className="glass-panel" style={{ margin: '1rem 2rem 0', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Key size={20} color="var(--accent-cyan)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Enter Pexels API Key</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Get a free API Key from <a href="https://www.pexels.com/api/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)' }}>pexels.com/api</a> to fetch live Pexels data.
            </div>
          </div>
          <input
            type="password"
            placeholder="Paste Pexels API Key..."
            value={customKey}
            onChange={(e) => setCustomKey(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: '#fff', width: '280px' }}
          />
          <button className="action-btn" onClick={handleSaveCustomKey}>Save Key</button>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        {error && (
          <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem', color: '#f87171' }}>
            ⚠️ {error.message} (Using curated demo fallback dataset below)
          </div>
        )}

        {/* 1. Grid View (Photos / Videos) */}
        {activeTab !== 'reels' && (
          <>
            <div {...getGridProps()} className="media-grid">
              {genericItems.map((item, index) => {
                const itemProps = getGridItemProps(item, index);
                return (
                  <div {...itemProps} className="grid-card">
                    {item.type === 'photo' ? (
                      <img src={item.previewUrl} alt={item.title} loading="lazy" />
                    ) : (
                      <video src={item.videoUrl} poster={item.previewUrl} muted loop playsInline />
                    )}
                    <div className="card-overlay">
                      <div className="card-title">{item.title}</div>
                      <div className="card-author">by {item.photographer}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Infinite Scroll Sentinel */}
            <div {...getSentinelProps()} style={{ height: '40px', marginTop: '2rem', textAlign: 'center' }}>
              {loadingMore && <span style={{ color: 'var(--text-secondary)' }}>Loading more items...</span>}
            </div>
          </>
        )}

        {/* 2. Reels View (Vertical TikTok-style Snap Swiper) */}
        {activeTab === 'reels' && (
          <div {...getContainerProps()} className="reels-container">
            {genericItems.map((item, index) => {
              const slideProps = getSlideProps(index);
              const isActive = index === activeReelIndex;
              return (
                <div {...slideProps} className="reel-item">
                  <video
                    src={item.videoUrl}
                    poster={item.previewUrl}
                    controls
                    autoPlay={isActive}
                    muted
                    loop
                    playsInline
                    className="reel-video"
                  />
                  <div className="reel-overlay">
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{item.title}</h3>
                    <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>@{item.photographer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* 3. Lightbox Modal */}
      {isLightboxOpen && lightboxActiveItem && (
        <div {...getBackdropProps()} className="lightbox-backdrop">
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {lightboxActiveItem.type === 'photo' ? (
              <img
                src={lightboxActiveItem.originalUrl || lightboxActiveItem.previewUrl}
                alt={lightboxActiveItem.title}
                className="lightbox-media"
              />
            ) : (
              <video
                src={lightboxActiveItem.videoUrl}
                poster={lightboxActiveItem.previewUrl}
                controls
                autoPlay
                className="lightbox-media"
              />
            )}

            <div className="lightbox-footer">
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{lightboxActiveItem.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Photographer: {lightboxActiveItem.photographer}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="nav-btn" {...getPrevButtonProps()}>
                  <ChevronLeft size={18} /> Prev
                </button>
                <button className="nav-btn" {...getNextButtonProps()}>
                  Next <ChevronRight size={18} />
                </button>
                <button className="action-btn" onClick={downloadCurrent}>
                  <Download size={16} /> Download
                </button>
                <button className="close-btn" {...getCloseButtonProps()}>
                  <X size={18} /> Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Activity Logs Sidebar Ticker */}
      <div className="activity-ticker glass-panel" style={{ height: isFeedOpen ? 'auto' : '44px', overflow: isFeedOpen ? 'auto' : 'hidden' }}>
        <div
          onClick={() => setIsFeedOpen(!isFeedOpen)}
          style={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', color: 'var(--accent-cyan)' }}
        >
          <span>📡 SDK Event Emitter Feed ({activityLogs.length})</span>
          <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{isFeedOpen ? '▼ Minimize' : '▲ Expand'}</span>
        </div>
        {isFeedOpen && (
          <div style={{ marginTop: '0.5rem' }}>
            {activityLogs.length === 0 && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '0.5rem 0' }}>
                No activity yet. Interact with media to trigger events.
              </div>
            )}
            {activityLogs.map((log, idx) => (
              <div key={idx} className="activity-item">
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

