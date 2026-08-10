"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMediaSearch = useMediaSearch;
exports.useMediaEvents = useMediaEvents;
exports.useMediaActions = useMediaActions;
const react_1 = require("react");
const core_1 = require("@media-sdk/core");
const MediaContext_js_1 = require("./MediaContext.js");
/**
 * Hook for searching media items with infinite pagination support
 */
function useMediaSearch(options = {}) {
    const client = (0, MediaContext_js_1.useMediaClient)();
    const { type: initialType = 'photo', perPage = 20, initialQuery = 'nature', autoFetch = true } = options;
    const [query, setQuery] = (0, react_1.useState)(initialQuery);
    const [mediaType, setMediaType] = (0, react_1.useState)(initialType);
    const [items, setItems] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [loadingMore, setLoadingMore] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [page, setPage] = (0, react_1.useState)(1);
    const [totalResults, setTotalResults] = (0, react_1.useState)(0);
    const fetchItems = (0, react_1.useCallback)(async (targetQuery, targetType, pageNum, append = false) => {
        if (pageNum === 1) {
            setLoading(true);
        }
        else {
            setLoadingMore(true);
        }
        setError(null);
        try {
            const params = { query: targetQuery, page: pageNum, perPage };
            let res;
            if (targetType === 'video') {
                res = await client.searchVideos(params);
            }
            else {
                res = await client.searchPhotos(params);
            }
            setPage(res.page);
            setTotalResults(res.totalResults);
            setItems((prev) => (append ? [...prev, ...res.items] : res.items));
        }
        catch (err) {
            setError(err instanceof core_1.SDKError ? err : new core_1.SDKError(err.message || 'Search failed'));
        }
        finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [client, perPage]);
    const search = (0, react_1.useCallback)(async (newQuery, newType) => {
        const activeType = newType || mediaType;
        setQuery(newQuery);
        setMediaType(activeType);
        setPage(1);
        await fetchItems(newQuery, activeType, 1, false);
    }, [fetchItems, mediaType]);
    const loadMore = (0, react_1.useCallback)(async () => {
        if (loading || loadingMore || items.length >= totalResults)
            return;
        const nextPage = page + 1;
        await fetchItems(query, mediaType, nextPage, true);
    }, [loading, loadingMore, items.length, totalResults, page, fetchItems, query, mediaType]);
    const refetch = (0, react_1.useCallback)(async () => {
        await fetchItems(query, mediaType, 1, false);
    }, [fetchItems, query, mediaType]);
    (0, react_1.useEffect)(() => {
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
function useMediaEvents(listener) {
    const client = (0, MediaContext_js_1.useMediaClient)();
    const listenerRef = (0, react_1.useRef)(listener);
    listenerRef.current = listener;
    (0, react_1.useEffect)(() => {
        const handler = (event) => listenerRef.current(event);
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
function useMediaActions() {
    const client = (0, MediaContext_js_1.useMediaClient)();
    const trackView = (0, react_1.useCallback)((item) => {
        client.trackView(item);
    }, [client]);
    const trackDownload = (0, react_1.useCallback)((item) => {
        client.trackDownload(item);
    }, [client]);
    return { trackView, trackDownload };
}
//# sourceMappingURL=hooks.js.map