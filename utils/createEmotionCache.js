"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cache_1 = require("@emotion/cache");
var isBrowser = typeof document !== "undefined";
// On the client side, Create a meta tag at the top of the <head> and set it as insertionPoint.
// This assures that MUI styles are loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
function createEmotionCache() {
    var insertionPoint;
    if (isBrowser) {
        var emotionInsertionPoint = document.querySelector('meta[name="emotion-insertion-point"]');
        insertionPoint = emotionInsertionPoint !== null && emotionInsertionPoint !== void 0 ? emotionInsertionPoint : undefined;
    }
    return (0, cache_1.default)({ key: "mui-style", insertionPoint: insertionPoint });
}
exports.default = createEmotionCache;
