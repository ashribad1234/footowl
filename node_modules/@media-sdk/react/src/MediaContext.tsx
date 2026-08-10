import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { MediaCoreClient, MediaCoreConfig, createMediaCore } from '@media-sdk/core';

interface MediaContextValue {
  client: MediaCoreClient;
}

const MediaContext = createContext<MediaContextValue | null>(null);

export interface MediaProviderProps {
  apiKey?: string;
  config?: MediaCoreConfig;
  client?: MediaCoreClient;
  children: ReactNode;
}

/**
 * MediaProvider Context Wrapper adapting media-core client to React tree
 */
export const MediaProvider: React.FC<MediaProviderProps> = ({
  apiKey,
  config,
  client: customClient,
  children,
}) => {
  const client = useMemo(() => {
    if (customClient) return customClient;
    if (config) return createMediaCore(config);
    if (apiKey) return createMediaCore({ apiKey });
    throw new Error('[MediaProvider] Requires either apiKey, config, or custom client instance');
  }, [apiKey, config, customClient]);

  const value = useMemo(() => ({ client }), [client]);

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
};

/**
 * Hook to access the raw MediaCoreClient instance
 */
export const useMediaClient = (): MediaCoreClient => {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMediaClient must be used within a <MediaProvider>');
  }
  return context.client;
};
