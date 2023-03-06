import { getDirective, MapperKind, mapSchema } from "@graphql-tools/utils"
import { defaultFieldResolver, GraphQLSchema } from "graphql"
import { AuthDirectiveResolver } from './generated/graphql'


export function authDirective(directiveName: string, getUserFn: (token: string) => { hasRole: (role: string) => boolean }) {
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
          console.log(_fieldName)
          const authDirective =
            getDirective(schema, fieldConfig, directiveName)?.[0] ?? typeDirectiveArgumentMaps[typeName]
          if (authDirective) {
            const { role } = authDirective
            if (role) {
              const { resolve = defaultFieldResolver } = fieldConfig
              fieldConfig.resolve = function(source, args, context, info) {
                const user = getUserFn(context.headers.authtoken)
                if (!user || !user.hasRole(role)) {
                  //throw new Error('not authorized')
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
