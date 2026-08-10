/**
 * Normalized Media Item Base Interface
 */
export type MediaType = 'photo' | 'video';

export interface BaseMediaItem {
  id: string | number;
  type: MediaType;
  title: string;
  url: string;
  photographer: string;
  photographerUrl: string;
  width: number;
  height: number;
  aspectRatio: number;
}

export interface PhotoItem extends BaseMediaItem {
  type: 'photo';
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

export interface VideoFile {
  id: number;
  quality: 'hd' | 'sd' | 'hls' | string;
  fileType: string;
  width: number | null;
  height: number | null;
  link: string;
  fps?: number;
}

export interface VideoPicture {
  id: number;
  picture: string;
  nr: number;
}

export interface VideoItem extends BaseMediaItem {
  type: 'video';
  duration: number;
  image: string;
  videoFiles: VideoFile[];
  videoPictures: VideoPicture[];
  hdUrl?: string;
  sdUrl?: string;
}

export type MediaItem = PhotoItem | VideoItem;

/**
 * Pexels API Request Search Options
 */
export interface SearchParams {
  query?: string;
  page?: number;
  perPage?: number;
  orientation?: 'landscape' | 'portrait' | 'squarish';
  size?: 'small' | 'medium' | 'large';
  locale?: string;
}

/**
 * Paginated API Response Wrapper
 */
export interface PaginatedResponse<T> {
  page: number;
  perPage: number;
  totalResults: number;
  nextPage?: string;
  prevPage?: string;
  items: T[];
}

/**
 * SDK Configuration Options
 */
export interface MediaCoreConfig {
  apiKey: string;
  baseUrl?: string;
  cacheTtlMs?: number;
  enableDefaultConsoleLogger?: boolean;
}

/**
 * SDK Event Emitter Types
 */
export type MediaEventType = 'view' | 'download' | 'search' | 'error';

export interface MediaEventPayload {
  view: { item: MediaItem; timestamp: number };
  download: { item: MediaItem; timestamp: number };
  search: { query: string; mediaType: MediaType; page: number; totalResults: number; timestamp: number };
  error: { message: string; code?: string | number; timestamp: number };
}

export interface MediaEvent<T extends MediaEventType = MediaEventType> {
  type: T;
  data: MediaEventPayload[T];
}

export type MediaEventListener<T extends MediaEventType = MediaEventType> = (
  event: MediaEvent<T>
) => void;

/**
 * Custom Error Class for SDK Failures
 */
export class SDKError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly code?: string
  ) {
    super(message);
    this.name = 'SDKError';
  }
}
