import express, { Express } from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http, { IncomingHttpHeaders } from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { GraphQLError } from 'graphql';
import { schema } from './schema';
import { authDirective, validateToken } from './auth';
import { getUser, loginUser, User } from './userService';
import { startupSript } from './db/db';

const { authDirectiveTransformer } = authDirective('auth');
const app: Express = express();
app.use(express.json());

const httpServer = http.createServer(app);

export type Context = {
  headers: IncomingHttpHeaders;
  user: User;
};

export const server = new ApolloServer<Context>({
  schema: authDirectiveTransformer(schema),
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

startupSript();

server.start().then(() => {
  const port = 8000;
  httpServer.listen(
    {
      port,
    },
    () => console.info(`server running on ${port}`) // eslint-disable-line no-console
  );
  app.use(cookieParser());
  app.get('/test', validateToken, async (_req, res) => {
    console.log('protected route');
    res.send('hello');
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    console.log(token);
    res.cookie('token', token, { httpOnly: true });
    res.send();
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
