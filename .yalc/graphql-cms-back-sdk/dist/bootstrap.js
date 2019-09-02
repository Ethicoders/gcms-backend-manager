"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const graphqlHTTP = require("express-graphql");
const json_1 = require("./utils/json");
const modules_1 = require("./modules");
const core_1 = require("@graphql-modules/core");
const defaultConfig = {
    app: {
        graphqlRoot: '/',
        port: 4000,
        graphiql: true,
    },
    plugin: {
        pluginsFilePath: __dirname + '/plugins.json',
    },
    database: {
        url: 'mongodb://localhost:27017',
        databaseName: 'test',
    },
    pluginsPath: __dirname + '/plugins'
};
/*
Check if default exports are supported by Elm/PureScript/other bundlers
If not, use named exports instead and loop over the object to get a
value that matches a plugin definition
*/
const getEnabledModules = plugins => {
    return plugins
        .filter(plugin => plugin.isEnabled)
        .map(plugin => require(`graphql-cms-${plugin.name}`).default);
};
exports.default = (inputConfig) => {
    const app = express();
    const config = Object.assign({}, defaultConfig, inputConfig);
    app.use(config.app.graphqlRoot, graphqlHTTP(async (request, response, graphQLParams) => {
        const pluginsFile = new json_1.default(config.plugin.pluginsFilePath);
        const plugins = await pluginsFile.read();
        const enabledModules = getEnabledModules(plugins);
        console.log(enabledModules);
        const RootModule = new core_1.GraphQLModule({
            imports: ({ config: { plugin, database } }) => [
                modules_1.DatabaseModule.forRoot(database),
                modules_1.PluginModule.forRoot(plugin),
                modules_1.ConsumerModule,
                ...enabledModules,
            ],
            configRequired: true,
        });
        // const test = RootModule.forRoot(config);
        const { schema } = RootModule.forRoot(config);
        // console.log(test.schema);
        // const { schema } = AppModule.forRoot(config);
        response.setHeader('Access-Control-Allow-Origin', '*');
        // SchemaDirectiveVisitor.visitSchemaDirectives(schema, schemaDirectives);
        // writeFileSync('schema.gql', printSchema(schema));
        return {
            schema,
            graphiql: config.app.graphiql,
        };
    }));
    const server = app.listen(config.app.port, () => {
        console.log(`Server ready at http://localhost:${config.app.port}${config.app.graphqlRoot}`);
    });
    return { server, app };
};
//# sourceMappingURL=bootstrap.js.map