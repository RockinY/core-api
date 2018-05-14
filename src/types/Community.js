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
  
  extend type Query {
    community(id: ID, slug: LowercaseString): Community
  }
`

module.exports = Community
