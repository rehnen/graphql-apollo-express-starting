/* eslint-disable no-param-reassign */
import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils";
import {
  defaultFieldResolver,
  GraphQLFieldConfig,
  GraphQLSchema,
} from "graphql";

export function authDirective(
  directiveName: string,
  getUserFn: (token: string) => { hasRole: (role: string) => Promise<boolean> }
) {
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
          const { role } = directive;
          if (role) {
            const { resolve = defaultFieldResolver } = fieldConfig;
            fieldConfig.resolve = async (source, args, context, info) => {
              const isAdmin = await getUserFn(
                context.headers.authtoken
              ).hasRole(role);
              if (!isAdmin) {
                return null;
              }
              return resolve(source, args, context, info);
            };
          }
        },
      }),
  };
}
