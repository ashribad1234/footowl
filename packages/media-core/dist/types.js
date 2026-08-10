"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDKError = void 0;
/**
 * Custom Error Class for SDK Failures
 */
class SDKError extends Error {
    status;
    code;
    constructor(message, status, code) {
        super(message);
        this.status = status;
        this.code = code;
        this.name = 'SDKError';
    }
}
exports.SDKError = SDKError;
//# sourceMappingURL=types.js.map