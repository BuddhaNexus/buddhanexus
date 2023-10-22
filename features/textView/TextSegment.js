"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextSegment = void 0;
// import { useRouter } from "next/router";
var next_themes_1 = require("next-themes");
var useDbQueryParams_1 = require("@components/hooks/useDbQueryParams");
var theme_1 = require("@components/theme");
var atoms_1 = require("features/atoms");
var dbSidebarHelpers_1 = require("features/sidebarSuite/common/dbSidebarHelpers");
var jotai_1 = require("jotai");
var use_query_params_1 = require("use-query-params");
var textSegment_module_scss_1 = require("./textSegment.module.scss");
var TextSegment = function (_a) {
    var _b = _a.data, segmentText = _b.segmentText, segmentNumber = _b.segmentNumber, 
    // index,
    colorScale = _a.colorScale;
    var theme = (0, next_themes_1.useTheme)().theme;
    var isDarkTheme = theme === "dark";
    // const router = useRouter();
    var sourceLanguage = (0, useDbQueryParams_1.useDbQueryParams)().sourceLanguage;
    var script = (0, jotai_1.useAtomValue)(atoms_1.scriptSelectionAtom);
    var _c = (0, use_query_params_1.useQueryParam)("selectedSegment"), selectedSegmentId = _c[0], setSelectedSegmentId = _c[1];
    var isSelected = selectedSegmentId === segmentNumber;
    return (<>
      <span className={"".concat(textSegment_module_scss_1.default.segmentNumber, " ").concat(isSelected && textSegment_module_scss_1.default.segmentNumber__selected)} data-segmentnumber={segmentNumber}/>

      {segmentText.map(function (_a) {
            var text = _a.text, highlightColor = _a.highlightColor;
            return (<button key={text} type="button" tabIndex={0} 
            // href={{
            //   pathname: "/db/[language]/[file]/text",
            //   query: {
            //     ...router.query,
            //     matches: matches.join(","),
            //     sort_method: "position",
            //   },
            // }}
            className={"".concat(textSegment_module_scss_1.default.segment, " ").concat(isSelected &&
                    (isDarkTheme
                        ? textSegment_module_scss_1.default.segment__selected__dark
                        : textSegment_module_scss_1.default.segment__selected__light))} style={{
                    fontFamily: theme_1.sourceSans.style.fontFamily,
                    color: colorScale(highlightColor).hex(),
                }} onClick={function () { return setSelectedSegmentId(segmentNumber); }} onKeyDown={function (event) {
                    // allow selecting the segments by pressing space or enter
                    if (event.key !== " " && event.key !== "Enter")
                        return;
                    event.preventDefault();
                    setSelectedSegmentId(segmentNumber);
                }}>
            {(0, dbSidebarHelpers_1.enscriptText)({ text: text, script: script, language: sourceLanguage })}
          </button>);
        })}
    </>);
};
exports.TextSegment = TextSegment;
