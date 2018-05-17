// @flow
const DirectMessageThread = `
  type DirectMessageThread {
    id: ID!
    threadLastActive: Date!
  }

  extend type Query {
    directMessageThread(id: ID!): DirectMessageThread
  }
`

module.exports = DirectMessageThread
