import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middleware-factory'
import { ForbiddenError } from 'apollo-server-errors'
import { defaultFieldResolver, GraphQLField } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

export class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition (field: GraphQLField<any, any>): any {
    const { resolve = defaultFieldResolver } = field
    field.resolve = async (parent, args, context, info) => {
      const request = {
        headers: {
          'x-access-token': context?.req?.headers?.['x-access-token']
        }
      }
      const httpResponse = await makeAuthMiddleware().handle(request)
      if (httpResponse.statusCode === 200) {
        Object.assign(context?.req, httpResponse.body)
        return resolve.call(this, parent, args, context, info)
      } else {
        throw new ForbiddenError(httpResponse.body.message)
      }
    }
  }
}
