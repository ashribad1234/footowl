import { MediaItem } from '@media-sdk/core';
import { GenericMediaItem } from '@media-sdk/ui-react';

/**
 * App Adapter: Converts SDK MediaItem to pure UI GenericMediaItem
 */
export function toGenericMediaItem(item: MediaItem): GenericMediaItem {
  if (item.type === 'photo') {
    return {
      id: item.id,
      type: 'photo',
      title: item.title,
      url: item.url,
      previewUrl: item.src.medium || item.src.large,
      originalUrl: item.src.original,
      photographer: item.photographer,
      photographerUrl: item.photographerUrl,
      aspectRatio: item.aspectRatio,
    };
  } else {
    return {
      id: item.id,
      type: 'video',
      title: item.title,
      url: item.url,
      previewUrl: item.image,
      originalUrl: item.hdUrl || item.sdUrl || item.image,
      videoUrl: item.hdUrl || item.sdUrl,
      photographer: item.photographer,
      photographerUrl: item.photographerUrl,
      aspectRatio: item.aspectRatio,
      duration: item.duration,
    };
  }
}
