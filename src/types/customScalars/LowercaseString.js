// @flow
import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

const LowercaseString = new GraphQLScalarType({
  name: 'LowercaseString',
  description: 'Returns all strings in lower case',
  parseValue (value) {
    if (typeof value === 'string') {
      return value.toLowerCase()
    }
    return ''
  },
  serialize (value) {
    if (typeof value === 'string') {
      return value.toLowerCase()
    }
    return ''
  },
  parseLiteral (ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value.toLowerCase()
    }
    return null
  }
})

export default LowercaseString
