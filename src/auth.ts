/* eslint-disable no-param-reassign */
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import {
  defaultFieldResolver,
  GraphQLFieldConfig,
  GraphQLSchema,
} from 'graphql';
import { Role } from './generated/graphql';

export function authDirective(directiveName: string) {
  const typeDirectiveArgumentMaps: Record<string, any> = {};
  return {
    authDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const directive = getDirective(schema, type, directiveName)?.[0];
          if (directive) {
            typeDirectiveArgumentMaps[type.name] = directive;
          }
          return undefined;
        },
        [MapperKind.OBJECT_FIELD]: (
          fieldConfig,
          _fieldName,
          typeName
        ): GraphQLFieldConfig<any, any, any> | undefined => {
          const directive =
            getDirective(
              schema,
              fieldConfig,

              directiveName
            )?.[0] ?? typeDirectiveArgumentMaps[typeName];
          if (!directive) {
            return;
          }
          console.log(directive);
          const { role }: { role: Role } = directive;
          if (role) {
            const { resolve = defaultFieldResolver } = fieldConfig;
            fieldConfig.resolve = async (source, args, context, info) => {
              const { user } = context;
              return user.roles.includes(role)
                ? resolve(source, args, context, info)
                : null;
            };
          }
        },
      }),
  };
}
