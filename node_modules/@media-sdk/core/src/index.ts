import { MediaCoreClient } from './client.js';
import { MediaCoreConfig } from './types.js';

export * from './types.js';
export * from './emitter.js';
export * from './cache.js';
export * from './client.js';

/**
 * Main SDK Factory Initializer
 */
export function createMediaCore(config: MediaCoreConfig): MediaCoreClient {
  return new MediaCoreClient(config);
}
