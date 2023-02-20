import express, { Express } from 'express';
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
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { join } from 'path';
import { Person, Resolvers } from './generated/graphql';

const typeDefs = loadSchemaSync(join(__dirname, 'schemas/schema.graphql'), { loaders: [new GraphQLFileLoader()] });
const resolvers: Resolvers = {
  Query: {
    hello: () => 'world',
    person: (): Person => {
      const person: Person = { firstName: 'marcus', lastName: 'rehn' };
      return person;
    },
  },
};

const app: Express = express();
const httpServer = http.createServer(app);
const server = new ApolloServer<BaseContext>({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
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
    expressMiddleware(server),
  );

});
