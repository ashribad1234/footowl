/**
 * React Native Headless UI Contract Stub
 * Shares generic UI item interfaces and hook signatures for RN FlatList/ScrollView components.
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

