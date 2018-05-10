const User = `
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
