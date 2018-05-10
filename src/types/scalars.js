// @flow
/**
 *
 * Custom scalars (data types, like Int, String...) live in this file.
 *
 */
import LowercaseString from './customScalars/LowercaseString'

const typeDefs = `
  scalar LowercaseString
`

const resolvers = {
  LowercaseString: LowercaseString
}

module.exports = {
  typeDefs,
  resolvers
}
