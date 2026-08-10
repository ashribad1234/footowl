import { MediaEvent, MediaEventListener, MediaEventType } from './types.js';

/**
 * Lightweight, Framework-Agnostic Event Emitter
 */
export class MediaEventEmitter {
  private listeners: Map<MediaEventType, Set<MediaEventListener<any>>> = new Map();

  /**
   * Subscribe to SDK events
   */
  public on<T extends MediaEventType>(type: T, listener: MediaEventListener<T>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(listener);

    // Return unsubscribe callback
    return () => this.off(type, listener);
  }

  /**
   * Unsubscribe from SDK events
   */
  public off<T extends MediaEventType>(type: T, listener: MediaEventListener<T>): void {
    const set = this.listeners.get(type);
    if (set) {
      set.delete(listener);
      if (set.size === 0) {
        this.listeners.delete(type);
      }
    }
  }

  /**
   * Emit an event to all active subscribers
   */
  public emit<T extends MediaEventType>(event: MediaEvent<T>): void {
    const set = this.listeners.get(event.type);
    if (set) {
      set.forEach((listener) => {
        try {
          listener(event);
        } catch (err) {
          console.error(`[MediaSDK Event Error] Handler failed for event ${event.type}:`, err);
        }
      });
    }
  }

  /**
   * Clear all listeners
   */
  public clear(): void {
    this.listeners.clear();
  }

  /**
   * Register default console logger listener (as per SDK requirement)
   */
  public registerDefaultConsoleLogger(): () => void {
    const defaultLogger: MediaEventListener = (event) => {
      console.log(`[MediaSDK Activity Log] ${event.type.toUpperCase()}:`, event.data);
    };

    const unsubView = this.on('view', defaultLogger);
    const unsubDownload = this.on('download', defaultLogger);
    const unsubSearch = this.on('search', defaultLogger);
    const unsubError = this.on('error', defaultLogger);

    return () => {
      unsubView();
      unsubDownload();
      unsubSearch();
      unsubError();
    };
  }
}
