import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils"
import { defaultFieldResolver, GraphQLError, GraphQLSchema } from "graphql"
import { AuthDirectiveResolver } from './generated/graphql'


export function authDirective(directiveName: string, getUserFn: (token: string) => { hasRole: (role: string) => Promise<boolean> }) {
  const typeDirectiveArgumentMaps: Record<string, any> = {}
  return {
    authDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: type => {
          const authDirective =
            getDirective(schema, type, directiveName)?.[0]
          if (authDirective) {
            typeDirectiveArgumentMaps[type.name] = authDirective
          }
          return undefined
        },
        [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
          const authDirective =
            getDirective(schema, fieldConfig, directiveName)?.[0] ?? typeDirectiveArgumentMaps[typeName]
          if (authDirective) {
            const { role } = authDirective
            if (role) {
              const { resolve = defaultFieldResolver } = fieldConfig
              fieldConfig.resolve = async function(source, args, context, info) {
                const isAdmin = await getUserFn(context.headers.authtoken).hasRole(role);
                if (!isAdmin) {
                  return null;
                }
                return resolve(source, args, context, info)

              }
              return fieldConfig
            }
          }
        }
      })
  }
}
