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
export declare function useReelSwiper(options: UseReelSwiperOptions): UseReelSwiperReturn;
//# sourceMappingURL=useReelSwiper.d.ts.map