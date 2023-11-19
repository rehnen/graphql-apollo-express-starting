import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { join } from 'path';
import { Person, Resolvers } from './generated/graphql';

const typeDefs = loadSchemaSync(join(__dirname, 'schemas/schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
});

const resolvers: Resolvers = {
  Query: {
    hello: (_, __, contextValue) => {
      console.log(contextValue);
      return 'world';
    },
    person: (a, b, contextValue, info): Person => {
      console.log(123456);
      console.log(a);
      console.log(b);
      console.log(contextValue);
      console.log(info.operation);
      console.log(123456);

      // _, __, contextValue, info // available parameters
      const person: Person = { firstName: 'marcus', lastName: 'rehn' };
      return person;
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
