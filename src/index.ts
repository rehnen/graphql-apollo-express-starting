import express, { Express } from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer, BaseContext } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

import { schema } from './schema';
import { authDirective } from './auth';
import { getUser } from './userService';

const { authDirectiveTransformer } = authDirective('auth', getUser);
const app: Express = express();

const httpServer = http.createServer(app);

export const server = new ApolloServer<BaseContext>({
  schema: authDirectiveTransformer(schema),
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

server.start().then(() => {
  const port = 8000;
  httpServer.listen(
    {
      port,
    },
    () => console.info(`server running on ${port}`) // eslint-disable-line no-console
  );
  app.get('/test', (_req, res) => {
    res.send('Express + TypeScript Server');
  });

  app.use(
    '/graphql',
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
