/* eslint-disable no-param-reassign */
import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import {
  defaultFieldResolver,
  GraphQLFieldConfig,
  GraphQLSchema,
} from 'graphql';
import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import { Role } from './generated/graphql';

export function authDirective(directiveName: string) {
  const typeDirectiveArgumentMaps: Record<string, any> = {};
  return {
    authDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.TYPE]: (type) => {
          const directive = getDirective(schema, type, directiveName)?.[0];
          console.log('type level', directive);
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
          const { role }: { role: Role } = directive;
          if (role) {
            const { resolve = defaultFieldResolver } = fieldConfig;
            console.log('roles')
            fieldConfig.resolve = async (source, args, context, info) => {
              const { user } = context;
              console.log('role', role)
              console.log(source)
              console.log(args)
              return user.roles.includes(role)
                ? resolve(source, args, context, info)
                : null;
            };
          }
          return fieldConfig;
        },
      }),
  };
}

export function validateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.cookies;
    jwt.verify(token, 'super secret');
    next();
  } catch (error) {
    res.clearCookie('token');
    res.redirect('/');
  }
}
