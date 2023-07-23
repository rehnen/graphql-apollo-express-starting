import express, { Express } from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http, { IncomingHttpHeaders } from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

import { GraphQLError } from 'graphql';
import { schema } from './schema';
import { authDirective } from './auth';
import { getUser, User } from './userService';

const { authDirectiveTransformer } = authDirective('auth');
const app: Express = express();

const httpServer = http.createServer(app);

export type Context = {
  headers: IncomingHttpHeaders;
  user: User;
};

export const server = new ApolloServer<Context>({
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
      context: async ({ req }) => {
        const user = await getUser(req.headers.token as string);
        if (!user) {
          throw new GraphQLError('Unauthenticated', {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: {
                status: 401,
              },
            },
          });
        }
        return {
          headers: req.headers,
          user,
        };
      },
    })
  );
});
