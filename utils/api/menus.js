"use strict";
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
exports.getCategoryMenuData = exports.getSourceTextMenuData = exports.getSourceTextCollections = void 0;
var _api_1 = require("@api");
var utils_1 = require("@components/treeView/utils");
function parseSourceTextCollectionData(data) {
    return data.navigationmenudata.map(function (_a) {
        var collection = _a.collection, categories = _a.categories;
        return ({
            collection: collection,
            categories: categories.map(function (_a) {
                var files = _a.files, categorydisplayname = _a.categorydisplayname, categoryname = _a.categoryname;
                return ({
                    files: files.map(function (_a) {
                        var textname = _a.textname, file_name = _a.file_name, available_lang = _a.available_lang, displayname = _a.displayname;
                        return ({
                            textName: textname,
                            displayName: displayname,
                            fileName: file_name,
                            availableLanguages: available_lang,
                        });
                    }),
                    name: categoryname,
                    displayName: categorydisplayname,
                });
            }),
        });
    });
}
function getSourceTextCollections(language) {
    return __awaiter(this, void 0, void 0, function () {
        var data, parsedApiData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _api_1.default.GET("/menus/sidebar/", {
                        params: { query: { language: language } },
                    })];
                case 1:
                    data = (_a.sent()).data;
                    parsedApiData = parseSourceTextCollectionData(data);
                    return [2 /*return*/, (0, utils_1.transformDataForTreeView)(parsedApiData)];
            }
        });
    });
}
exports.getSourceTextCollections = getSourceTextCollections;
function getSourceTextMenuData(language) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var data, srcTextData;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, _api_1.default.GET("/menus/files/", {
                        params: { query: { language: language } },
                    })];
                case 1:
                    data = (_c.sent()).data;
                    srcTextData = data;
                    return [2 /*return*/, ((_b = (_a = srcTextData === null || srcTextData === void 0 ? void 0 : srcTextData.results) === null || _a === void 0 ? void 0 : _a.map(function (text) {
                            var displayName = text.displayName, search_field = text.search_field, textname = text.textname, filename = text.filename, category = text.category;
                            return {
                                id: filename,
                                name: displayName,
                                label: displayName,
                                fileName: filename,
                                textName: textname,
                                category: category,
                                searchMatter: search_field,
                            };
                        })) !== null && _b !== void 0 ? _b : [])];
            }
        });
    });
}
exports.getSourceTextMenuData = getSourceTextMenuData;
function getCategoryMenuData(language) {
    return __awaiter(this, void 0, void 0, function () {
        var data, categoryData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, _api_1.default.GET("/menus/category/", {
                        params: { query: { language: language } },
                    })];
                case 1:
                    data = (_a.sent()).data;
                    categoryData = data;
                    return [2 /*return*/, categoryData.categoryitems
                            .flat()
                            .reduce(function (map, cat) {
                            var category = cat.category, categoryname = cat.categoryname;
                            map.set(category, { id: category, name: categoryname });
                            return map;
                        }, new Map())];
            }
        });
    });
}
exports.getCategoryMenuData = getCategoryMenuData;
