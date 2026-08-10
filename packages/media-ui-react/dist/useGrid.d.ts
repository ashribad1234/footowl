import { GenericMediaItem, GridPropGetters } from './types.js';
export interface UseGridOptions {
    items: GenericMediaItem[];
    hasMore?: boolean;
    loading?: boolean;
    onLoadMore?: () => void;
    onItemClick?: (item: GenericMediaItem, index: number) => void;
}
export interface UseGridReturn extends GridPropGetters {
    items: GenericMediaItem[];
}
export declare function useGrid(options: UseGridOptions): UseGridReturn;
//# sourceMappingURL=useGrid.d.ts.map