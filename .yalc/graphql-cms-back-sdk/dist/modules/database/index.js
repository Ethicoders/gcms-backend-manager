"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@graphql-modules/core");
const graphql_tag_1 = require("graphql-tag");
const Database_1 = require("./providers/Database");
exports.default = new core_1.GraphQLModule({
    name: 'Database',
    typeDefs: [
        graphql_tag_1.default `
      type Entity {
        name: String!
        fields: [Field!]!
        canCreate: Boolean
        canUpdate: Boolean
        canDelete: Boolean
      }

      type Field {
        name: String!
        isRequired: Boolean
        isPublic: Boolean
      }
    `,
    ],
    providers: ({ config: { url, databaseName } }) => {
        return [
            {
                provide: 'DB',
                useFactory: () => {
                    return Database_1.default.instantiate(url, databaseName);
                },
            },
        ];
    },
    configRequired: true,
});
//# sourceMappingURL=index.js.map