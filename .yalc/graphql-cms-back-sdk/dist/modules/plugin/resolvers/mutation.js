"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Plugin_1 = require("../providers/Plugin");
exports.default = {
    Mutation: {
        updatePlugin: (root, { plugin }, { injector }) => {
            injector.get(Plugin_1.default).updatePlugin(plugin);
            return {
                plugin,
            };
        },
    },
};
//# sourceMappingURL=mutation.js.map