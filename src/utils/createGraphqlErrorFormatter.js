// @flow
import { IsUserError } from './userError'
import type { GraphQLError } from 'graphql'
import type { express$Request } from 'express'

const debug = require('debug')('api:utils:error-formatter')
const queryRe = /\s*(query|mutation)[^{]*/

const collectQueries = query => {
  if (!query) return 'No query'
  return query
    .split('\n')
    .map(line => {
      const m = line.match(queryRe)
      return m ? m[0].trim() : ''
    })
    .filter(line => !!line)
    .join('\n')
}

const errorPath = error => {
  if (!error.path) return ''
  return error.path
    .map((value, index) => {
      if (!index) {
        return value
      }
      return typeof value === 'number' ? `[$value]` : `.${value}`
    })
}

const logGraphQLError = (req, error) => {
  debug('---GraphQL Error---')
  debug(error)
  if (req) {
    debug(collectQueries(req.body.query))
    debug('variables', JSON.stringify(req.body.variables || {}))
  }
  const path = errorPath(error)
  path && debug('path', path)
  debug('-------------------\n')
}

const createGraphqlErrorFormatter = (req?: express$Request) => (error: GraphQLError) => {
  logGraphQLError(req, error)
  const isUserError = error.originalError
    ? error.originalError[IsUserError]
    : error[IsUserError]
  return {
    message: isUserError ? error.message : `Internal server error`,
    stack:
      !process.env.NODE_ENV === 'production' ? error.stack.split('\n') : null
  }
}

export default createGraphqlErrorFormatter
