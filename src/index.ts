import express, { Express } from "express";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServer, BaseContext } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { loadSchemaSync } from "@graphql-tools/load";

import { makeExecutableSchema } from "@graphql-tools/schema";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { join } from "path";
import { Person, Resolvers, Role } from "./generated/graphql";
import { authDirective } from "./auth";

const typeDefs = loadSchemaSync(join(__dirname, "schemas/schema.graphql"), {
  loaders: [new GraphQLFileLoader()],
});
const resolvers: Resolvers = {
  Query: {
    hello: () => "world",
    person: (): Person => {
      // _, __, contextValue, info // available parameters
      const person: Person = { firstName: "marcus", lastName: "rehn" };
      return person;
    },
  },
};

const app: Express = express();

const httpServer = http.createServer(app);

function getUser(token: string) {
  const roles = ["USER", "ADMIN"];
  return {
    hasRole: (role: Role): Promise<boolean> => {
      const tokenIndex = roles.indexOf(token);
      const roleIndex = roles.indexOf(role);
      return new Promise((res) => {
        setTimeout(() => {
          if (tokenIndex) {
            return res(roles[tokenIndex] === role);
          }
          return res(roleIndex >= 0 && tokenIndex >= roleIndex);
        }, 1000);
      });
    },
  };
}

const { authDirectiveTransformer } = authDirective("auth", getUser);
const schema = authDirectiveTransformer(
  makeExecutableSchema({
    typeDefs,
    resolvers,
  })
);

const server = new ApolloServer<BaseContext>({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

server.start().then(() => {
  const port = 8000;
  httpServer.listen(
    {
      port,
    },
    () => console.log(`server running on ${port}`)
  );
  app.get("/test", (req, res) => {
    res.send("Express + TypeScript Server");
  });

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({
        headers: req.headers,
        models: {
          Person: req.headers.authorization,
        },
        authScope: req.headers.authorization,
      }),
    })
  );
});
