"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Entity {
    constructor(name, fields) {
        this.name = name;
        this.fields = fields;
        this.canCreate = true;
        this.canUpdate = true;
        this.canDelete = true;
    }
}
exports.Entity = Entity;
class Field {
    constructor(name, conditionals) {
        this.name = name;
        this.conditionals = conditionals;
        this.isRequired = false;
        this.isPublic = true;
    }
}
exports.Field = Field;
class Conditional {
}
exports.Conditional = Conditional;
var OPERATORS;
(function (OPERATORS) {
    OPERATORS[OPERATORS["=="] = 0] = "==";
    OPERATORS[OPERATORS["<="] = 1] = "<=";
    OPERATORS[OPERATORS[">="] = 2] = ">=";
    OPERATORS[OPERATORS["<"] = 3] = "<";
    OPERATORS[OPERATORS[">"] = 4] = ">";
    OPERATORS[OPERATORS["!="] = 5] = "!=";
    OPERATORS[OPERATORS["LIKE"] = 6] = "LIKE";
    OPERATORS[OPERATORS["NOT LIKE"] = 7] = "NOT LIKE";
    OPERATORS[OPERATORS["IN"] = 8] = "IN";
    OPERATORS[OPERATORS["NOT IN"] = 9] = "NOT IN";
})(OPERATORS || (OPERATORS = {}));
const ent = new Entity('posts', [
    new Field('title')
]);
//# sourceMappingURL=entity.js.map