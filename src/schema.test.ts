import { ApolloServer, BaseContext } from '@apollo/server';
import gql from 'graphql-tag';
import { schema } from './schema';

describe('dummy test suit', () => {
  const server = new ApolloServer<BaseContext>({ schema });
  it('starts at all', async () => {
    const result = await server.executeOperation({
      query: gql`
        query ExampleQuery {
          hello
        }
      `,
    });

    const value = result.body.kind === 'single' ? result.body.singleResult : {};

    expect(JSON.stringify(value)).toEqual(`{"data":{"hello":"world"}}`);
  });

  it('provides the correct', async () => {
    const result = await server.executeOperation({
      query: gql`
        query ExampleQuery {
          person {
            firstName
            lastName
          }
        }
      `,
    });

    const value = result.body.kind === 'single' ? result.body.singleResult : {};
    expect(JSON.stringify(value)).toEqual(
      `{"data":{"person":{"firstName":"marcus","lastName":"rehn"}}}`
    );
  });
});
