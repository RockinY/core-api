// @flow
const CommunityMember = /* GraphQL */ `
  type CommunityMember {
    id: ID!
    user: User!
    roles: [String]
    isMember: Boolean
    isModerator: Boolean
    isOwner: Boolean
    isBlocked: Boolean
    isPending: Boolean
    reputation: Int
  }

  extend type Query {
    communityMember(userId: ID!, communityId: ID!): CommunityMember		
  }
`