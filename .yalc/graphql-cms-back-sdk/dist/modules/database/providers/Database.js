"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const di_1 = require("@graphql-modules/di");
let Database = class Database {
    static async instantiate(url, databaseName) {
        const client = new mongodb_1.MongoClient(url, { useNewUrlParser: true });
        await client.connect();
        return client.db(databaseName);
    }
};
Database = __decorate([
    di_1.Injectable()
], Database);
exports.default = Database;
//# sourceMappingURL=Database.js.map