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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const types_1 = require("./types");
const json_1 = require("../../utils/json");
const di_1 = require("@graphql-modules/di");
let default_1 = class default_1 {
    constructor(plugins) {
        this.plugins = plugins;
    }
    // @Inject('Plugins')
    // private readonly plugins: FileJSON;
    getPlugins() {
        return this.plugins.read();
    }
    async updatePlugin(plugin) {
        const plugins = this.updatePluginByName(plugin.name, plugin);
        await this.updatePlugins(plugins);
        return {
            plugin,
        };
    }
    updatePlugins(plugins) {
        return this.plugins.write(plugins);
    }
    async getPluginByName(name) {
        const plugins = await this.plugins.read();
        return plugins.find(item => item.name === name);
    }
    async updatePluginByName(name, data) {
        const plugins = await this.plugins.read();
        for (let i = 0; i < plugins.length; ++i) {
            if (plugins[i].name === name) {
                plugins[i] = Object.assign({}, this.preparePluginData(data));
                break;
            }
        }
        return plugins;
    }
    preparePluginData(data) {
        return Object.assign({ isEnabled: false }, data);
    }
};
__decorate([
    type_graphql_1.Query(returns => [types_1.Plugin]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], default_1.prototype, "getPlugins", null);
__decorate([
    type_graphql_1.Mutation(returns => types_1.PluginUpdate),
    __param(0, type_graphql_1.Arg('plugin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [types_1.PluginInput]),
    __metadata("design:returntype", Promise)
], default_1.prototype, "updatePlugin", null);
default_1 = __decorate([
    type_graphql_1.Resolver(),
    __param(0, di_1.Inject('Plugins')),
    __metadata("design:paramtypes", [json_1.default])
], default_1);
exports.default = default_1;
//# sourceMappingURL=resolver.js.map