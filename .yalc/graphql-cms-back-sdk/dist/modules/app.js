"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@graphql-modules/core");
const plugin_1 = require("./plugin");
const database_1 = require("./database");
const consumer_1 = require("./consumer");
exports.default = new core_1.GraphQLModule({
    imports: ({ config: { plugin, database } }) => [
        database_1.default.forRoot(database),
        plugin_1.default.forRoot(plugin),
        consumer_1.default,
    ],
    configRequired: true,
});
//# sourceMappingURL=app.js.map