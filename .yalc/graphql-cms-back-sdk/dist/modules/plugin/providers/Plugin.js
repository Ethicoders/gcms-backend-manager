"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const di_1 = require("@graphql-modules/di");
const json_1 = require("../../../utils/json");
let Plugin = class Plugin {
    constructor(filePath) {
        this.pluginsFile = new json_1.default(filePath);
    }
    getPlugins() {
        return this.pluginsFile.read();
    }
    async updatePlugin(plugin) {
        const plugins = await this.getPlugins();
        plugins.some((row, index) => {
            if (row.name === plugin.name) {
                plugins[index] = plugin;
            }
        });
        this.pluginsFile.write(plugins);
    }
};
Plugin = __decorate([
    di_1.Injectable(),
    __metadata("design:paramtypes", [String])
], Plugin);
exports.default = Plugin;
//# sourceMappingURL=Plugin.js.map