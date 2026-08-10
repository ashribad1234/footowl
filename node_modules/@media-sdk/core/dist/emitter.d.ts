import { MediaEvent, MediaEventListener, MediaEventType } from './types.js';
/**
 * Lightweight, Framework-Agnostic Event Emitter
 */
export declare class MediaEventEmitter {
    private listeners;
    /**
     * Subscribe to SDK events
     */
    on<T extends MediaEventType>(type: T, listener: MediaEventListener<T>): () => void;
    /**
     * Unsubscribe from SDK events
     */
    off<T extends MediaEventType>(type: T, listener: MediaEventListener<T>): void;
    /**
     * Emit an event to all active subscribers
     */
    emit<T extends MediaEventType>(event: MediaEvent<T>): void;
    /**
     * Clear all listeners
     */
    clear(): void;
    /**
     * Register default console logger listener (as per SDK requirement)
     */
    registerDefaultConsoleLogger(): () => void;
}
//# sourceMappingURL=emitter.d.ts.map