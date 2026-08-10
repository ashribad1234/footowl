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
export declare function useLightbox(options: UseLightboxOptions): UseLightboxReturn;
//# sourceMappingURL=useLightbox.d.ts.map