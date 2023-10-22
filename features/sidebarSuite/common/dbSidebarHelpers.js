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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enscriptText = exports.onEmailQueryLink = exports.onCopyQueryLink = exports.onCopyQueryTitle = exports.onDownload = exports.defaultAnchorEls = exports.isSettingOmitted = exports.getQueryParamsFromRouter = void 0;
var tibetan_ewts_converter_1 = require("tibetan-ewts-converter");
var downloads_1 = require("utils/api/downloads");
var constants_1 = require("utils/constants");
/**
 * Next.js stores dynamic routes in the router object query prop which is also where api query params are pushed to. Dynamic route params need to be removed to avoid polluting result page urls and sending unaccepted params in api requests.
 *
 * @see {@link https://nextjs.org/docs/pages/api-reference/functions/use-router#router-object}.
 *
 */
var getQueryParamsFromRouter = function (_a) {
    var route = _a.route, params = _a.params;
    var apiEndpointParams = new URLSearchParams(params);
    apiEndpointParams.delete("file");
    if (!route.startsWith("/search")) {
        apiEndpointParams.delete("language");
    }
    return apiEndpointParams;
};
exports.getQueryParamsFromRouter = getQueryParamsFromRouter;
var isSettingOmitted = function (_a) {
    var _b, _c;
    var omissions = _a.omissions, settingName = _a.settingName, language = _a.language, view = _a.view;
    return Boolean((_c = (_b = omissions === null || omissions === void 0 ? void 0 : omissions[settingName]) === null || _b === void 0 ? void 0 : _b[view]) === null || _c === void 0 ? void 0 : _c.some(function (omittedLang) {
        return ["allLangs", language].includes(omittedLang);
    }));
};
exports.isSettingOmitted = isSettingOmitted;
exports.defaultAnchorEls = {
    download: null,
    copyQueryTitle: null,
    copyQueryLink: null,
    emailQueryLink: null,
};
var onDownload = function (_a) {
    var download = _a.download, event = _a.event, popperAnchorStateHandler = _a.popperAnchorStateHandler;
    return __awaiter(void 0, void 0, void 0, function () {
        var anchorEl, setAnchorEl, file, getDownload;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    anchorEl = popperAnchorStateHandler[0], setAnchorEl = popperAnchorStateHandler[1];
                    return [4 /*yield*/, (0, downloads_1.getParallelDownloadData)({
                            fileName: download.fileName,
                            queryParams: download.queryParams,
                        })];
                case 1:
                    file = _b.sent();
                    if (file) {
                        getDownload = download.call;
                        getDownload(file.url, file.name);
                    }
                    setAnchorEl(__assign(__assign({}, exports.defaultAnchorEls), { download: anchorEl.download
                            ? null
                            : event.nativeEvent.target }));
                    return [2 /*return*/];
            }
        });
    });
};
exports.onDownload = onDownload;
var onCopyQueryTitle = function (_a) {
    var event = _a.event, fileName = _a.fileName, popperAnchorStateHandler = _a.popperAnchorStateHandler;
    return __awaiter(void 0, void 0, void 0, function () {
        var anchorEl, setAnchorEl;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    anchorEl = popperAnchorStateHandler[0], setAnchorEl = popperAnchorStateHandler[1];
                    setAnchorEl(__assign(__assign({}, exports.defaultAnchorEls), { copyQueryTitle: anchorEl.copyQueryTitle ? null : event.currentTarget }));
                    return [4 /*yield*/, navigator.clipboard.writeText(fileName)];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.onCopyQueryTitle = onCopyQueryTitle;
var onCopyQueryLink = function (_a) {
    var event = _a.event, popperAnchorStateHandler = _a.popperAnchorStateHandler, href = _a.href;
    return __awaiter(void 0, void 0, void 0, function () {
        var anchorEl, setAnchorEl;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    anchorEl = popperAnchorStateHandler[0], setAnchorEl = popperAnchorStateHandler[1];
                    setAnchorEl(__assign(__assign({}, exports.defaultAnchorEls), { copyQueryLink: anchorEl.copyQueryLink ? null : event.currentTarget }));
                    return [4 /*yield*/, navigator.clipboard.writeText(href)];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
};
exports.onCopyQueryLink = onCopyQueryLink;
var onEmailQueryLink = function (_a) {
    var event = _a.event, fileName = _a.fileName, popperAnchorStateHandler = _a.popperAnchorStateHandler, href = _a.href;
    var anchorEl = popperAnchorStateHandler[0], setAnchorEl = popperAnchorStateHandler[1];
    var encodedURL = encodeURIComponent(href);
    var subject = "BuddhaNexus serach results - ".concat(fileName.toUpperCase());
    var body = "Here is a link to search results for ".concat(fileName.toUpperCase(), ": ").concat(encodedURL);
    var link = document.createElement("a");
    link.href = "mailto:?subject=".concat(subject, "&body=").concat(body);
    link.click();
    setAnchorEl(__assign(__assign({}, exports.defaultAnchorEls), { emailQueryLink: anchorEl.emailQueryLink ? null : event.currentTarget }));
};
exports.onEmailQueryLink = onEmailQueryLink;
var ewts = new tibetan_ewts_converter_1.EwtsConverter();
var enscriptText = function (_a) {
    var text = _a.text, language = _a.language, script = _a.script;
    return script === "Wylie" && language === constants_1.SourceLanguage.TIBETAN
        ? ewts.to_unicode(text)
        : text;
};
exports.enscriptText = enscriptText;
//  TODO: clarify spec - is disabling logically impossible (per include/exclude filter selections) desired behaviour? Applies to all included/excluded filters.
//
//   const [disableSelectors, setDisableSelectors] = useAtom(
//     disableLimitColectionSelectAtom
//   );
//   function setIsSelectorDisabled(
//     key: keyof QueryValues["limit_collection"],
//     value: boolean
//   ) {
//     setDisableSelectors((prevState) => {
//       const updates = {
//         excludedCategories: {},
//         excludedTexts: {},
//         includedCategories: {
//           excludedCategories: !value,
//           excludedTexts: !value,
//         },
//         includedTexts: {
//           excludedCategories: !value,
//           excludedTexts: !value,
//           includedCategories: !value,
//         },
//       };
//       return { ...prevState, ...updates[key] };
//     });
//   }
