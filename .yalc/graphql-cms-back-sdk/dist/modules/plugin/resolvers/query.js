"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Plugin_1 = require("../providers/Plugin");
exports.default = {
    Query: {
        getPlugins: (root, args, { injector }) => injector.get(Plugin_1.default).getPlugins(),
    },
};
//# sourceMappingURL=query.js.map