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
const Community = require('./types/Community')
const Channel = require('./types/Channel')

// Queries
const userQueries = require('./queries/user')
const communityQueries = require('./queries/community')
const channelQueries = require('./queries/channel')

// Mutations
const userMutations = require('./mutations/user')

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
  userQueries,
  communityQueries,
  channelQueries,
  // Mutations
  userMutations
)

if (process.env.NODE_ENV === 'development' && debug.enabled) {
  logExecutions(resolvers)
}

const schema = makeExecutableSchema({
  typeDefs: [
    scalars.typeDefs,
    Root,
    User,
    Community,
    Channel
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
