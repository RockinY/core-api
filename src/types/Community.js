// @flow
const Community = `
	type CommunityChannelsConnection {
		pageInfo: PageInfo!
		edges: [CommunityChannelEdge!]
	}

	type CommunityChannelEdge {
		node: Channel!
	}

	type CommunityMembersConnection @deprecated(reason:"Use the new Community.members type") {
		pageInfo: PageInfo!
		edges: [CommunityMemberEdge!]
	}

	type CommunityMemberEdge @deprecated(reason:"Use the new Community.members type") {
		cursor: String!
		node: User!
	}

	type CommunityMembers {
		pageInfo: PageInfo!
		edges: [CommunityMembersEdge!]
	}

	type CommunityMembersEdge {
		cursor: String!
		node: CommunityMember!
	}

	type CommunityThreadsConnection {
		pageInfo: PageInfo!
		edges: [CommunityThreadEdge!]
	}

	type CommunityThreadEdge {
		cursor: String!
		node: Thread!
	}

	type CommunityMetaData {
		members: Int
		channels: Int
  }
  
  type TopAndNewThreads {
		topThreads: [Thread]
		newThreads: [Thread]
  }
  
  type BrandedLogin {
		isEnabled: Boolean
		message: String
	}

  type Community {
    id: ID!
		createdAt: Date
		name: String!
		slug: LowercaseString!
		description: String
		website: String
		profilePhoto: String
		coverPhoto: String
		reputation: Int
		pinnedThreadId: String
		pinnedThread: Thread
		isPrivate: Boolean
    communityPermissions: CommunityPermissions @cost(complexity: 1)
    channelConnection: CommunityChannelsConnection @cost(complexity: 1)
    members(first: Int = 10, after: String, filter: MembersFilter): CommunityMembers @cost(complexity: 5, multiplier: "first")
    threadConnection(first: Int = 10, after: String): CommunityThreadsConnection @cost(complexity: 2, multiplier: "first")
    metaData: CommunityMetaData @cost(complexity: 10)
    memberGrowth: GrowthData @cost(complexity: 10)
    conversationGrowth: GrowthData @cost(complexity: 3)
    topMembers: [CommunityMember] @cost(complexity: 10)
    topAndNewThreads: TopAndNewThreads @cost(complexity: 4)
		watercooler: Thread
		brandedLogin: BrandedLogin
		joinSettings: JoinSettings
	}
	
	input MembersFilter {
		isOwner: Boolean
		isMember: Boolean
		isBlocked: Boolean
		isPending: Boolean
		isModerator: Boolean
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
		communities(slugs: [LowercaseString], ids: [ID], curatedContentType: String): [Community]
		communityMember(userId: String, communityId: String): CommunityMember
    topCommunities(amount: Int = 20): [Community!] @cost(complexity: 4, multiplier: "amount")
		recentCommunities: [Community!]
  }

  extend type Mutation {
    createCommunity(input: CreateCommunityInput!): Community
  }
`

module.exports = Community
