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
    hello: () => 'world',
    person: (): Person => {
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
