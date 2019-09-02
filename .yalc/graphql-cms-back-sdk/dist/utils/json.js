"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs_1 = require("../async/fs");
class default_1 {
    constructor(filePath) {
        this.path = path.normalize(filePath);
    }
    async read() {
        return JSON.parse(await fs_1.readFile(this.path));
    }
    write(data) {
        return fs_1.writeFile(this.path, JSON.stringify(data, null, 2));
    }
}
exports.default = default_1;
//# sourceMappingURL=json.js.map