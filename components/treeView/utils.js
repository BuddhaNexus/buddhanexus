"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformDataForTreeView = void 0;
var types_1 = require("@components/treeView/types");
function transformDataForTreeView(data) {
    return data.map(function (collection) { return ({
        id: collection.collection,
        name: collection.collection,
        dataType: types_1.NodeDataChildType.Collection,
        children: collection.categories.map(function (_a) {
            var name = _a.name, displayName = _a.displayName, files = _a.files;
            return ({
                id: name,
                name: displayName,
                dataType: types_1.NodeDataChildType.Category,
                children: files.map(function (_a) {
                    var fileName = _a.fileName, fileDisplayName = _a.displayName, textName = _a.textName, availableLanguages = _a.availableLanguages;
                    return ({
                        id: textName,
                        name: fileDisplayName,
                        fileName: fileName,
                        availableLanguages: availableLanguages,
                        dataType: types_1.NodeDataChildType.Text,
                    });
                }),
            });
        }),
    }); });
}
exports.transformDataForTreeView = transformDataForTreeView;
