"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceLanguageChip = void 0;
var react_1 = require("react");
var material_1 = require("@mui/material");
var constants_1 = require("utils/constants");
var getLanguageColor = function (language, theme) {
    switch (language) {
        case constants_1.SourceLanguage.PALI: {
            return theme.palette.common.pali;
        }
        case constants_1.SourceLanguage.TIBETAN: {
            return theme.palette.common.tibetan;
        }
        case constants_1.SourceLanguage.CHINESE: {
            return theme.palette.common.chinese;
        }
        case constants_1.SourceLanguage.SANSKRIT: {
            return theme.palette.common.sanskrit;
        }
        default: {
            return theme.palette.common.black;
        }
    }
};
function SourceLanguageChip(_a) {
    var label = _a.label, language = _a.language;
    var theme = (0, material_1.useTheme)();
    var languageBadgeColor = (0, react_1.useCallback)(function () { return getLanguageColor(language, theme); }, [language, theme]);
    return (<material_1.Chip size="small" label={label} sx={{
            m: 0.5,
            p: 0.5,
            color: "white",
            fontWeight: 700,
            backgroundColor: languageBadgeColor,
            width: "fit-content",
        }}/>);
}
exports.SourceLanguageChip = SourceLanguageChip;
