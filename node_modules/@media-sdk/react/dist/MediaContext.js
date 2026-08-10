"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMediaClient = exports.MediaProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const core_1 = require("@media-sdk/core");
const MediaContext = (0, react_1.createContext)(null);
/**
 * MediaProvider Context Wrapper adapting media-core client to React tree
 */
const MediaProvider = ({ apiKey, config, client: customClient, children, }) => {
    const client = (0, react_1.useMemo)(() => {
        if (customClient)
            return customClient;
        if (config)
            return (0, core_1.createMediaCore)(config);
        if (apiKey)
            return (0, core_1.createMediaCore)({ apiKey });
        throw new Error('[MediaProvider] Requires either apiKey, config, or custom client instance');
    }, [apiKey, config, customClient]);
    const value = (0, react_1.useMemo)(() => ({ client }), [client]);
    return (0, jsx_runtime_1.jsx)(MediaContext.Provider, { value: value, children: children });
};
exports.MediaProvider = MediaProvider;
/**
 * Hook to access the raw MediaCoreClient instance
 */
const useMediaClient = () => {
    const context = (0, react_1.useContext)(MediaContext);
    if (!context) {
        throw new Error('useMediaClient must be used within a <MediaProvider>');
    }
    return context.client;
};
exports.useMediaClient = useMediaClient;
//# sourceMappingURL=MediaContext.js.map