"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLightbox = useLightbox;
const react_1 = require("react");
function useLightbox(options) {
    const { items, initialIndex = 0, isOpen: controlledIsOpen, onClose, onView, onDownload } = options;
    const [internalIsOpen, setInternalIsOpen] = (0, react_1.useState)(false);
    const [activeIndex, setActiveIndex] = (0, react_1.useState)(initialIndex);
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
    const activeItem = isOpen && items.length > 0 && items[activeIndex] ? items[activeIndex] : null;
    const openAt = (0, react_1.useCallback)((index) => {
        setActiveIndex(index);
        setInternalIsOpen(true);
    }, []);
    const close = (0, react_1.useCallback)(() => {
        setInternalIsOpen(false);
        onClose?.();
    }, [onClose]);
    const next = (0, react_1.useCallback)(() => {
        if (activeIndex < items.length - 1) {
            setActiveIndex((prev) => prev + 1);
        }
    }, [activeIndex, items.length]);
    const prev = (0, react_1.useCallback)(() => {
        if (activeIndex > 0) {
            setActiveIndex((prev) => prev - 1);
        }
    }, [activeIndex]);
    const downloadCurrent = (0, react_1.useCallback)(() => {
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
    (0, react_1.useEffect)(() => {
        if (isOpen && activeItem) {
            onView?.(activeItem);
        }
    }, [isOpen, activeItem, onView]);
    // Keyboard navigation & accessibility
    (0, react_1.useEffect)(() => {
        if (!isOpen)
            return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                close();
            }
            else if (e.key === 'ArrowRight') {
                next();
            }
            else if (e.key === 'ArrowLeft') {
                prev();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, close, next, prev]);
    const getBackdropProps = (0, react_1.useCallback)(() => ({
        role: 'dialog',
        'aria-modal': true,
        tabIndex: -1,
        onClick: (e) => {
            if (e.target === e.currentTarget)
                close();
        },
        onKeyDown: (e) => {
            if (e.key === 'Escape')
                close();
        },
    }), [close]);
    const getCloseButtonProps = (0, react_1.useCallback)(() => ({
        'aria-label': 'Close Lightbox Modal',
        onClick: close,
    }), [close]);
    const getNextButtonProps = (0, react_1.useCallback)(() => ({
        'aria-label': 'Next Media Item',
        onClick: next,
        disabled: activeIndex >= items.length - 1,
    }), [next, activeIndex, items.length]);
    const getPrevButtonProps = (0, react_1.useCallback)(() => ({
        'aria-label': 'Previous Media Item',
        onClick: prev,
        disabled: activeIndex <= 0,
    }), [prev, activeIndex]);
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
//# sourceMappingURL=useLightbox.js.map