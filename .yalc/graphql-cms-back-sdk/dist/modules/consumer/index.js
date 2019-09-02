"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@graphql-modules/core");
const database_1 = require("../database");
const graphql_tag_1 = require("graphql-tag");
const mutation_1 = require("./resolvers/mutation");
const query_1 = require("./resolvers/query");
const consumer_1 = require("./resolvers/consumer");
exports.default = new core_1.GraphQLModule({
    name: 'Consumer',
    typeDefs: graphql_tag_1.default `
    type Consumer {
      login: String!
      password: String
    }

    type Query {
      getConsumer(id: ID): Consumer!
      getConsumers: [Consumer!]
    }

    type AuthPayload {
      consumer: Consumer!
      token: String!
    }

    type Mutation {
      updateConsumer(consumer: ConsumerUpdateInput!): ConsumerUpdatePayload
      signIn(login: String!, password: String!): AuthPayload!
      signUp(login: String!, password: String!): AuthPayload!
      #   signOut(): AuthPayload!
      #   refreshSession(): AuthPayload!
    }

    input ConsumerCreateInput {
      login: String!
    }

    type ConsumerCreatePayload {
      consumer: Consumer
    }

    input ConsumerUpdateInput {
      login: String!
    }

    type ConsumerUpdatePayload {
      consumer: Consumer
    }
  `,
    imports: [database_1.default],
    resolvers: Object.assign({}, mutation_1.default, query_1.default, consumer_1.default),
});
//# sourceMappingURL=index.js.map