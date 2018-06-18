// @flow
const Reaction = `
  enum ReactionTypes {
    like
  }

  type Reaction {
    id: ID!
    timestamp: Date!
    message: Message!
    user: User!
    type: ReactionTypes!
  }

  extend type Query {
    messageId: ID!
    reaction(id: String!): Reaction
  }

  input ReactionInput {
    messageId: ID!
    type: ReactionTypes!
  }

  extend type Mutation {
    toggleReaction(reaction: ReactionInput!): Message
  }
`

module.exports = Reaction
