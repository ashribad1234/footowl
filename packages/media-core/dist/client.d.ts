import { MediaCoreConfig, MediaItem, PhotoItem, VideoItem, PaginatedResponse, SearchParams } from './types.js';
import { MediaEventEmitter } from './emitter.js';
export declare class MediaCoreClient {
    private apiKey;
    private baseUrl;
    readonly events: MediaEventEmitter;
    private cache;
    constructor(config: MediaCoreConfig);
    /**
     * Set or update API key at runtime
     */
    setApiKey(newKey: string): void;
    /**
     * Universal Internal Fetcher with Auth, Error Handling, and Demo Fallback
     */
    private request;
    /**
     * Search Photos with Fallback on 401/Invalid Key
     */
    searchPhotos(params: SearchParams): Promise<PaginatedResponse<PhotoItem>>;
    /**
     * Search Videos with Fallback on 401/Invalid Key
     */
    searchVideos(params: SearchParams): Promise<PaginatedResponse<VideoItem>>;
    getCuratedPhotos(page?: number, perPage?: number): Promise<PaginatedResponse<PhotoItem>>;
    getPopularVideos(page?: number, perPage?: number): Promise<PaginatedResponse<VideoItem>>;
    getPhotoById(id: string | number): Promise<PhotoItem>;
    getVideoById(id: string | number): Promise<VideoItem>;
    trackView(item: MediaItem): void;
    trackDownload(item: MediaItem): void;
    private normalizePhoto;
    private normalizeVideo;
}
//# sourceMappingURL=client.d.ts.map