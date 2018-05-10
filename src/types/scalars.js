// @flow
/**
 *
 * Custom scalars (data types, like Int, String...) live in this file.
 *
 */
import LowercaseString from './customScalars/LowercaseString'
import { GraphQLUpload } from 'apollo-upload-server'
import GraphQLDate from 'graphql-date'

const typeDefs = `
  scalar LowercaseString
  scalar Upload
  scalar Date
`

const resolvers = {
  Date: GraphQLDate,
  Upload: GraphQLUpload,
  LowercaseString: LowercaseString
}

module.exports = {
  typeDefs,
  resolvers
}
