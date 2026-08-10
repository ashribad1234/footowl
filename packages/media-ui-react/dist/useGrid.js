"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGrid = useGrid;
const react_1 = require("react");
function useGrid(options) {
    const { items, hasMore = false, loading = false, onLoadMore, onItemClick } = options;
    const observerRef = (0, react_1.useRef)(null);
    const sentinelRef = (0, react_1.useCallback)((node) => {
        if (loading)
            return;
        if (observerRef.current)
            observerRef.current.disconnect();
        if (node && hasMore && onLoadMore) {
            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    onLoadMore();
                }
            }, { rootMargin: '300px' });
            observerRef.current.observe(node);
        }
    }, [loading, hasMore, onLoadMore]);
    (0, react_1.useEffect)(() => {
        return () => {
            if (observerRef.current)
                observerRef.current.disconnect();
        };
    }, []);
    const getGridProps = (0, react_1.useCallback)(() => ({
        role: 'grid',
        'aria-label': 'Media Gallery Grid',
    }), []);
    const getGridItemProps = (0, react_1.useCallback)((item, index) => ({
        key: String(item.id),
        role: 'gridcell',
        tabIndex: 0,
        onClick: () => onItemClick?.(item, index),
        onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onItemClick?.(item, index);
            }
        },
    }), [onItemClick]);
    const getSentinelProps = (0, react_1.useCallback)(() => ({
        ref: sentinelRef,
        'aria-hidden': true,
    }), [sentinelRef]);
    return {
        items,
        getGridProps,
        getGridItemProps,
        getSentinelProps,
    };
}
//# sourceMappingURL=useGrid.js.map