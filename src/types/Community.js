// @flow
const Community = `
  type Community {
    id: ID!,
    createdAt: Date!
    name: String!
    slug: LowercaseString!
    description: String!
    website: String
    profilePhoto: String
    coverPhoto: String
    reputation: Int
  }

  input CreateCommunityInput {
    name: String!
    slug: LowercaseString!
    description: String!
    website: String
    file: Upload
    coverFile: Upload
  }
  
  extend type Query {
    community(id: ID, slug: LowercaseString): Community
  }

  extend type Mutation {
    createCommunity(input: CreateCommunityInput!): Community
  }
`

module.exports = Community
