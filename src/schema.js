// @flow
import UserError from './utils/userError'
import {
  makeExecutableSchema,
  addSchemaLevelResolveFunction
} from 'graphql-tools'
import { merge } from 'lodash'

const debug = require('debug')('api:resolvers')
const logExecutions = require('graphql-log')({
  logger: debug
})

// Types
const scalars = require('./types/scalars')
const User = require('./types/User')

// Queries
const userQueries = require('./queries/user')

const Root = `
  type Query {
    dummy: String
  }

  type Mutation {
    dummy: String
  }

  type Subscription {
    dummy: String
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
`

const resolvers = merge(
  {},
  // Queries
  scalars.resolvers,
  userQueries
)

if (process.env.NODE_ENV === 'development' && debug.enabled) {
  logExecutions(resolvers)
}

const schema = makeExecutableSchema({
  typeDefs: [
    scalars.typeDefs,
    Root,
    User
  ],
  resolvers
})

if (process.env.REACT_APP_MAINTENANCE_MODE === 'enabled') {
  console.error('\n\n⚠️ ----MAINTENANCE MODE ENABLED----⚠️\n\n')
  addSchemaLevelResolveFunction(schema, () => {
    throw new UserError(
      "We're currently undergoing planned maintenance!"
    )
  })
}

module.exports = schema
