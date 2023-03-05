import express, { Express } from 'express';
import { GraphQLError, GraphQLSchema, defaultFieldResolver } from 'graphql';
import { expressMiddleware } from '@apollo/server/express4';
import {
  ApolloServer, BaseContext,
} from '@apollo/server';
import {
  ApolloServerPluginDrainHttpServer,
} from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { loadSchemaSync } from '@graphql-tools/load';
import { mapSchema, MapperKind, getDirective } from '@graphql-tools/utils';

import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { join } from 'path';
import { Person, Resolvers, Role } from './generated/graphql';
import { authDirective } from './auth';

const typeDefs = loadSchemaSync(join(__dirname, 'schemas/schema.graphql'), { loaders: [new GraphQLFileLoader()] });
const resolvers: Resolvers = {
  Query: {
    hello: () => 'world',
    person: (_, __, contextValue, info): Person => {
      const person: Person = { firstName: 'marcus', lastName: 'rehn' };
      return person;
    },
  },
};

const app: Express = express();
const httpServer = http.createServer(app);




function getUser(token: string) {
  const roles = ['UNKNOWN', 'USER', 'REVIEWER', 'ADMIN']
  console.log(token)
  return {
    hasRole: (role: string) => {
      const tokenIndex = roles.indexOf(token);
      const roleIndex = roles.indexOf(role);
      return roleIndex >= 0 && tokenIndex >= roleIndex;
    }
  }
}

const { authDirectiveTransformer } = authDirective('auth', getUser);
const schema = authDirectiveTransformer(makeExecutableSchema({
  typeDefs,
  resolvers,
}));

console.log('this is some cools stuf')

const server = new ApolloServer<BaseContext>({
  schema
});


server.start().then(() => {

  const port = 8000;
  httpServer.listen({
    port,
  }, () => console.log(`server running on ${port}`));
  app.get('/test', (req, res) => {
    res.send('Express + TypeScript Server');
  });

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        return {
          headers: req.headers,
          models: {
            Person: req.headers.authorization ? Role.Admin : Role.User,
          },
          authScope: req.headers.authorization
        }
      }
    }),
  );

});
