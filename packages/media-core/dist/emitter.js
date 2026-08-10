"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaEventEmitter = void 0;
/**
 * Lightweight, Framework-Agnostic Event Emitter
 */
class MediaEventEmitter {
    listeners = new Map();
    /**
     * Subscribe to SDK events
     */
    on(type, listener) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        this.listeners.get(type).add(listener);
        // Return unsubscribe callback
        return () => this.off(type, listener);
    }
    /**
     * Unsubscribe from SDK events
     */
    off(type, listener) {
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
    emit(event) {
        const set = this.listeners.get(event.type);
        if (set) {
            set.forEach((listener) => {
                try {
                    listener(event);
                }
                catch (err) {
                    console.error(`[MediaSDK Event Error] Handler failed for event ${event.type}:`, err);
                }
            });
        }
    }
    /**
     * Clear all listeners
     */
    clear() {
        this.listeners.clear();
    }
    /**
     * Register default console logger listener (as per SDK requirement)
     */
    registerDefaultConsoleLogger() {
        const defaultLogger = (event) => {
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
exports.MediaEventEmitter = MediaEventEmitter;
//# sourceMappingURL=emitter.js.map