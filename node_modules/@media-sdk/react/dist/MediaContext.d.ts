import React, { ReactNode } from 'react';
import { MediaCoreClient, MediaCoreConfig } from '@media-sdk/core';
export interface MediaProviderProps {
    apiKey?: string;
    config?: MediaCoreConfig;
    client?: MediaCoreClient;
    children: ReactNode;
}
/**
 * MediaProvider Context Wrapper adapting media-core client to React tree
 */
export declare const MediaProvider: React.FC<MediaProviderProps>;
/**
 * Hook to access the raw MediaCoreClient instance
 */
export declare const useMediaClient: () => MediaCoreClient;
//# sourceMappingURL=MediaContext.d.ts.map