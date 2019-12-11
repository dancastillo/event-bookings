import "graphql-import-node";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { ApolloServer } from "apollo-server-express";
import depthLimit from "graphql-depth-limit";

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(7)]
});
