"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReelSwiper = useReelSwiper;
const react_1 = require("react");
function useReelSwiper(options) {
    const { items, initialIndex = 0, onActiveIndexChange, onItemView } = options;
    const [activeIndex, setActiveIndex] = (0, react_1.useState)(initialIndex);
    const containerRef = (0, react_1.useRef)(null);
    const activeItem = items[activeIndex] || null;
    const handleScroll = (0, react_1.useCallback)((e) => {
        const container = e.currentTarget;
        containerRef.current = container;
        const scrollTop = container.scrollTop;
        const clientHeight = container.clientHeight;
        if (clientHeight === 0)
            return;
        const newIndex = Math.round(scrollTop / clientHeight);
        if (newIndex !== activeIndex && newIndex >= 0 && newIndex < items.length) {
            setActiveIndex(newIndex);
            const item = items[newIndex];
            if (item) {
                onActiveIndexChange?.(newIndex, item);
                onItemView?.(item);
            }
        }
    }, [activeIndex, items, onActiveIndexChange, onItemView]);
    const scrollToIndex = (0, react_1.useCallback)((index) => {
        if (containerRef.current && index >= 0 && index < items.length) {
            const height = containerRef.current.clientHeight;
            containerRef.current.scrollTo({
                top: index * height,
                behavior: 'smooth',
            });
            setActiveIndex(index);
        }
    }, [items.length]);
    const getContainerProps = (0, react_1.useCallback)(() => ({
        role: 'region',
        'aria-label': 'Vertical Video Reels Feed',
        tabIndex: 0,
        onScroll: handleScroll,
    }), [handleScroll]);
    const getSlideProps = (0, react_1.useCallback)((index) => ({
        key: String(items[index]?.id || index),
        'data-active': index === activeIndex,
    }), [activeIndex, items]);
    return {
        activeIndex,
        activeItem,
        scrollToIndex,
        getContainerProps,
        getSlideProps,
    };
}
//# sourceMappingURL=useReelSwiper.js.map