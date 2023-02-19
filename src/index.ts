import express,
{
  Express,
} from 'express';
import {
  expressMiddleware,
} from '@apollo/server/express4';
import {
  ApolloServer,
} from '@apollo/server';
import {
  ApolloServerPluginDrainHttpServer,
} from '@apollo/server/plugin/drainHttpServer';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

const typeDefs = `
  type Query {
    hello: String
}
`;

const resolvers = {
  Query: {
    hello: () => 'world',
  },
};

const app: Express = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({
    httpServer,
  }),
  ],
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
    cors(),
    bodyParser.json(),
  );

  app.all(
    '/graphql',
    expressMiddleware(server),
  );
});
