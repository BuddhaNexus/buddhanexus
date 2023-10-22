"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchBoxInput = exports.SearchBoxWrapper = exports.AppTopBarSearchBoxWrapper = void 0;
var material_1 = require("@mui/material");
var styles_1 = require("@mui/material/styles");
exports.AppTopBarSearchBoxWrapper = (0, styles_1.styled)("form")(function (_a) {
    var theme = _a.theme, isOpen = _a.isOpen;
    return ({
        width: "100%",
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.grey[100],
        "&:hover": {
            backgroundColor: theme.palette.grey[200],
        },
        transform: "scaleX(".concat(isOpen ? 1 : 0, ")"),
        transformOrigin: "left",
        opacity: "".concat(isOpen ? 1 : 0),
        transition: "".concat(isOpen ? "transform 200ms, opacity 100ms" : "transform 200ms, opacity 500ms"),
        overflow: "hidden",
    });
});
exports.SearchBoxWrapper = (0, styles_1.styled)("form")(function (_a) {
    var theme = _a.theme;
    return ({
        borderRadius: theme.shape.borderRadius,
        border: "".concat(theme.palette.primary.main, " 1px solid"),
    });
});
exports.SearchBoxInput = (0, styles_1.styled)(material_1.TextField, {
    shouldForwardProp: function (prop) { return prop !== "isNarrow"; },
})(function (_a) {
    var isNarrow = _a.isNarrow;
    return ({
        "& .MuiOutlinedInput-root": __assign(__assign({ padding: "0px" }, (isNarrow && {
            "& input": {
                paddingTop: "12px",
                paddingBottom: "12px",
            },
        })), { "& fieldset": {
                borderColor: "transparent",
            }, "&:hover fieldset": {
                borderColor: "transparent",
            }, "&.Mui-focused fieldset": {
                borderColor: "transparent",
            } }),
    });
});
