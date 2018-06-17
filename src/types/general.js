// @flow
/**
 * General, reusable types
 */

const general = /* GraphQL */ `
  type PageInfo {
		hasNextPage: Boolean
		hasPreviousPage: Boolean
	}

	type ChannelPermissions {
		isMember: Boolean
		isBlocked: Boolean
		isPending: Boolean
		isOwner: Boolean
		isModerator: Boolean
		receiveNotifications: Boolean
	}

	type CommunityPermissions {
		isMember: Boolean
		isBlocked: Boolean
		isOwner: Boolean
		isModerator: Boolean
		isPending: Boolean
		receiveNotifications: Boolean
		reputation: Int
	}

  input File {
    name: String!
    type: String!
    size: Int!
    path: String!
  }

	type GrowthDataCounts {
    growth: Float
    currentPeriodCount: Int
    prevPeriodCount: Int
  }

  type GrowthData {
    count: Int
    weeklyGrowth: GrowthDataCounts
    monthlyGrowth: GrowthDataCounts
    quarterlyGrowth: GrowthDataCounts
	}
	
	input EmailInviteContactInput {
		email: LowercaseString!
		firstName: String
		lastName: String
	}

	input EmailInvitesInput {
		id: ID!
		contacts: [ EmailInviteContactInput ]
		customMessage: String
	}

	type JoinSettings {
		tokenJoinEnabled: Boolean
		token: String
	}
`

module.exports = general