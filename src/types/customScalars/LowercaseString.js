// @flow
import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import { stringToLowerCasePinyin } from '../../utils/pinyin'

// https://stackoverflow.com/questions/41510880/whats-the-difference-between-parsevalue-and-parseliteral-in-graphqlscalartype

const LowercaseString = new GraphQLScalarType({
  name: 'LowercaseString',
  description: 'Returns all strings in lower case',
  // Parsing input variables
  parseValue (value) {
    if (typeof value === 'string') {
      return stringToLowerCasePinyin(value)
    }
    return ''
  },
  // Parse value when send to client
  serialize (value) {
    if (typeof value === 'string') {
      return stringToLowerCasePinyin(value)
    }
    return ''
  },
  // Parsing inline variables when read input
  parseLiteral (ast) {
    if (ast.kind === Kind.STRING) {
      return stringToLowerCasePinyin(ast.value)
    }
    return null
  }
})

export default LowercaseString
