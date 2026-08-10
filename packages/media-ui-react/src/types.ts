/**
 * Pure UI Generic Media Contract (Independent of Core SDK)
 */
export interface GenericMediaItem {
  id: string | number;
  type: 'photo' | 'video';
  title: string;
  url: string;
  previewUrl: string;
  originalUrl: string;
  photographer: string;
  photographerUrl?: string;
  aspectRatio?: number;
  videoUrl?: string;
  duration?: number;
}

export interface GridPropGetters {
  getGridProps: () => {
    role: string;
    'aria-label': string;
  };
  getGridItemProps: (item: GenericMediaItem, index: number) => {
    key: string | number;
    role: string;
    tabIndex: number;
    onClick: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
  };
  getSentinelProps: () => {
    ref: (node: HTMLElement | null) => void;
    'aria-hidden': boolean;
  };
}

export interface LightboxPropGetters {
  getBackdropProps: () => {
    role: string;
    'aria-modal': boolean;
    tabIndex: number;
    onClick: (e: React.MouseEvent) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
  };
  getCloseButtonProps: () => {
    'aria-label': string;
    onClick: () => void;
  };
  getNextButtonProps: () => {
    'aria-label': string;
    onClick: () => void;
    disabled: boolean;
  };
  getPrevButtonProps: () => {
    'aria-label': string;
    onClick: () => void;
    disabled: boolean;
  };
}

export interface SwiperPropGetters {
  getContainerProps: () => {
    role: string;
    tabIndex: number;
    onScroll: (e: React.UIEvent<HTMLElement>) => void;
  };
  getSlideProps: (index: number) => {
    key: string | number;
    'data-active': boolean;
  };
}
