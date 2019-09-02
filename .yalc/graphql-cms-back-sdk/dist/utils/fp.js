"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compose = (...functions) => x => functions.reduceRight((v, f) => f(v), x);
exports.pipe = (...functions) => x => functions.reduce((v, f) => f(v), x);
//# sourceMappingURL=fp.js.map