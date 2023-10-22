"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_LOCALES = exports.SOURCE_LANGUAGES = exports.SourceLanguage = void 0;
// eslint-disable-next-line no-shadow
var SourceLanguage;
(function (SourceLanguage) {
    SourceLanguage["PALI"] = "pli";
    SourceLanguage["CHINESE"] = "chn";
    SourceLanguage["TIBETAN"] = "tib";
    SourceLanguage["SANSKRIT"] = "skt";
})(SourceLanguage || (exports.SourceLanguage = SourceLanguage = {}));
exports.SOURCE_LANGUAGES = [
    SourceLanguage.SANSKRIT,
    SourceLanguage.TIBETAN,
    SourceLanguage.PALI,
    SourceLanguage.CHINESE,
];
// i18n
exports.SUPPORTED_LOCALES = {
    en: "English",
    de: "Deutsch",
};
