"use strict";
const filesystem = require("fs");
const util_1 = require("util");
const functions = {};
['writeFile', 'readFile'].forEach(property => {
    functions[property] = util_1.promisify(filesystem[property]);
});
const fs = functions;
module.exports = fs;
//# sourceMappingURL=fs.js.map