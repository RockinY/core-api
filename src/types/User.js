const User = `
  type NotificationKindSettings {
    email: Boolean
  }

  type NotificationSettingsType {
    newMessageInThreads: NotificationKindSettings
    newDirectMessage: NotificationKindSettings
    newThreadCreated: NotificationKindSettings
    weeklyDigest: NotificationKindSettings
    dailyDigest: NotificationKindSettings
    newMention: NotificationKindSettings
  }

  type UserNotificationsSettings {
    types: NotificationSettingsType
  }

  type UserSettings {
    notifications: UserNotificationsSettings
  }
  
  type User {
    id: ID!
    name: String
    firstName: String
    description: String
    website: String
    username: LowercaseString
    profilePhoto: String
    coverPhoto: String
    email: LowercaseString
    providerId: String
    createdAt: Date!
    lastSeen: Date!
    isOnline: Boolean
    timezone: Int
    totalReputation: Int
    pendingEmail: LowercaseString

    # non-schema fields
    settings: UserSettings @cost(complexity: 1)
  }

  extend type Query {
    user(id: ID, username: LowercaseString): User
    currentUser: User
  }

  input EditUserInput {
    file: Upload
    coverFile: Upload
    name: String
    description: String
    Website: String
    username: LowercaseString
    timezone: Int
  }

  extend type Mutation {
    editUser(input: EditUserInput!): User
  }
`

module.exports = User
