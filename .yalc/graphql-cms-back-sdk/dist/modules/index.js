"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_1 = require("./plugin");
exports.PluginModule = plugin_1.default;
const database_1 = require("./database");
exports.DatabaseModule = database_1.default;
const consumer_1 = require("./consumer");
exports.ConsumerModule = consumer_1.default;
exports.default = [plugin_1.default, database_1.default, consumer_1.default];
//# sourceMappingURL=index.js.map