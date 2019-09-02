"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@graphql-modules/core");
const graphql_tag_1 = require("graphql-tag");
const Plugin_1 = require("./providers/Plugin");
const mutation_1 = require("./resolvers/mutation");
const query_1 = require("./resolvers/query");
const plugin_1 = require("./resolvers/plugin");
exports.default = new core_1.GraphQLModule({
    typeDefs: graphql_tag_1.default `
    type Plugin {
      name: String!
      isEnabled: Boolean!
    }

    type Query {
      getPlugins: [Plugin!]!
    }

    type Mutation {
      updatePlugin(plugin: PluginUpdateInput!): PluginUpdatePayload
    }

    input PluginUpdateInput {
      name: String!
      isEnabled: Boolean
    }

    type PluginUpdatePayload {
      plugin: Plugin
    }
  `,
    providers: ({ config: { pluginsFilePath } }) => {
        return [
            {
                provide: Plugin_1.default,
                useFactory: () => new Plugin_1.default(pluginsFilePath),
            },
        ];
    },
    resolvers: Object.assign({}, mutation_1.default, query_1.default, plugin_1.default),
    configRequired: true,
});
//# sourceMappingURL=index.js.map