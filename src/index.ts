import express, { Express } from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import http, { IncomingHttpHeaders } from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

// import { GraphQLError } from 'graphql';
import { schema } from './schema';
import { authDirective, validateToken } from './auth';
import { getUser, loginUser, User } from './userService';
import { startupSript } from './db/db';
import { GreetRequest } from './proto/services/hello/v1/hello_service';
import { Language_Code } from './proto/com/language/v1/language';
import { getHelloService } from './services/HelloService';

const { authDirectiveTransformer } = authDirective('auth');
const app: Express = express();
app.use(express.json());
app.use(cookieParser());

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

const helloService = getHelloService();
const greeting: GreetRequest = {
  name: 'Alice',
  languageCode: Language_Code.CODE_EN,
};

server.start().then(() => {
  const port = 8000;
  httpServer.listen(
    {
      port,
    },
    () => console.info(`server running on ${port}`) // eslint-disable-line no-console
  );
  app.get('/test', validateToken, async (_req, res) => {
    console.log('protected route');

    helloService.greet(greeting).then((response) => res.send(response));
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.cookie('token', token, { httpOnly: true });
    res.send();
  });

  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    validateToken,
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const user = await getUser(req.cookies.token as string);

        return {
          headers: req.cookies,
          user,
        };
      },
    })
  );
});
