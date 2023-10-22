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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyledPopper = exports.ListboxComponent = void 0;
var react_1 = require("react");
var react_window_1 = require("react-window");
var material_1 = require("@mui/material");
var styles_1 = require("@mui/styles");
var OuterElementContext = react_1.default.createContext({});
// eslint-disable-next-line react/display-name
var OuterElementType = react_1.default.forwardRef(function (props, ref) {
    var outerProps = react_1.default.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps}/>;
});
function useResetCache(data) {
    var ref = react_1.default.useRef(null);
    react_1.default.useEffect(function () {
        // eslint-disable-next-line eqeqeq,no-eq-null
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}
// px
var LISTBOX_PADDING = 8;
var Row = function (props) {
    var data = props.data, index = props.index, style = props.style;
    var dataSet = data[index];
    var inlineStyle = __assign(__assign({}, style), { top: style.top + LISTBOX_PADDING, fontWeight: 700 });
    if (Object.hasOwn(dataSet, "group")) {
        return (<material_1.ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
        {dataSet.group}
      </material_1.ListSubheader>);
    }
    var dataSetProps = dataSet[0], _a = dataSet[1], name = _a.name, ref = _a.ref;
    return (<material_1.Box {...dataSetProps} style={inlineStyle} sx={{
            display: "flex",
            justifyContent: "space-between",
            flex: 1,
            "&:nth-of-type(even)": {
                bgcolor: "background.accent",
            },
            "&:hover": { textDecoration: "underline" },
        }} component="li">
      <div style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            padding: "4px 0",
        }}>
        <material_1.Typography sx={{
            display: "inline",
            whiteSpace: "normal",
            wordBreak: "break-all",
        }}>
          <material_1.Typography component="span" variant="subtitle2" sx={{
            textTransform: "uppercase",
            fontWeight: 600,
            pr: 1,
        }}>
            {ref}
          </material_1.Typography>
          {name.replaceAll(/^•\s/g, "")}
        </material_1.Typography>
      </div>
    </material_1.Box>);
};
// Adapter for react-window
exports.ListboxComponent = react_1.default.forwardRef(function ListboxComponent(props, ref) {
    var children = props.children, other = __rest(props, ["children"]);
    var itemData = [];
    // eslint-disable-next-line unicorn/no-array-for-each
    children.forEach(function (item) {
        var _a;
        itemData.push.apply(itemData, __spreadArray([item], ((_a = item.children) !== null && _a !== void 0 ? _a : []), false));
    });
    var itemCount = itemData.length;
    var itemSize = 56;
    var getChildSize = function (child) {
        // eslint-disable-next-line no-prototype-builtins
        if (child.hasOwnProperty("group")) {
            return 48;
        }
        var charsInLine = 58;
        // @ts-expect-error type issue
        var lineCount = Math.ceil(child[1].name.length / charsInLine);
        return itemSize * lineCount;
    };
    var getHeight = function () {
        if (itemCount > 8) {
            return 10 * itemSize;
        }
        return itemData.map(getChildSize).reduce(function (a, b) { return a + b; }, 0);
    };
    var gridRef = useResetCache(itemCount);
    return (<div ref={ref}>
      <OuterElementContext.Provider value={other}>
        {/* TODO: replace react-window with newer package */}
        {/* @ts-expect-error type issue */}
        <react_window_1.VariableSizeList ref={gridRef} itemData={itemData} height={getHeight() + 2 * LISTBOX_PADDING} width="100%" 
    // @ts-expect-error type issue
    outerElementType={OuterElementType} innerElementType="ul" itemSize={function (index) { var _a; return getChildSize((_a = itemData[index]) !== null && _a !== void 0 ? _a : 0); }} overscanCount={5} itemCount={itemCount}>
          {Row}
        </react_window_1.VariableSizeList>
      </OuterElementContext.Provider>
    </div>);
});
exports.StyledPopper = (0, styles_1.styled)(material_1.Popper)((_a = {},
    _a["& .".concat(material_1.autocompleteClasses.listbox)] = {
        boxSizing: "border-box",
        "& ul": {
            padding: 0,
            margin: 0,
        },
    },
    _a));
